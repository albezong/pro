package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.ModulePermission;
import com.mycompany.myapp.domain.Profile;
import com.mycompany.myapp.repository.ModulePermissionRepository;
import com.mycompany.myapp.repository.ProfileRepository;
import com.mycompany.myapp.security.SecurityUtils;
import com.mycompany.myapp.service.dto.UserPermissionsDTO;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Central service for evaluating dynamic permissions per user/module/action.
 *
 * IMPORTANTE: ROLE_ADMIN de JHipster NO da acceso automático a todo.
 * El acceso se determina SIEMPRE por la tabla module_permission del perfil
 * asignado.
 * Solo isSuperAdmin=true en el perfil asignado da acceso total.
 *
 * ROLE_ADMIN sigue siendo necesario para /api/admin/** (gestión de usuarios
 * JHipster),
 * pero NO influye en la lógica de permisos de módulos.
 */
@Service
@Transactional(readOnly = true)
public class PermissionService {

    private static final Logger LOG = LoggerFactory.getLogger(PermissionService.class);

    private final ProfileRepository profileRepository;
    private final ModulePermissionRepository modulePermissionRepository;

    public PermissionService(ProfileRepository profileRepository, ModulePermissionRepository modulePermissionRepository) {
        this.profileRepository = profileRepository;
        this.modulePermissionRepository = modulePermissionRepository;
    }

    /**
     * Checks if the currently authenticated user has the given action on the given
     * module.
     * Evaluated purely from DB — ROLE_ADMIN is NOT a bypass.
     */
    public boolean hasPermission(String moduleName, String action) {
        Optional<String> login = SecurityUtils.getCurrentUserLogin();
        if (login.isEmpty()) return false;
        return hasPermissionForUser(login.orElseThrow(), moduleName, action);
    }

    /**
     * Checks if a specific user has the given action on the given module.
     * Evaluated purely from DB — ROLE_ADMIN is NOT a bypass.
     */
    public boolean hasPermissionForUser(String login, String moduleName, String action) {
        List<Profile> profiles = profileRepository.findActiveProfilesByUserLogin(login);
        for (Profile profile : profiles) {
            // isSuperAdmin in the profile = full access to everything
            if (Boolean.TRUE.equals(profile.getIsSuperAdmin())) return true;
            Optional<ModulePermission> perm = modulePermissionRepository.findByProfileIdAndModuleName(profile.getId(), moduleName);
            if (perm.isPresent() && checkAction(perm.orElseThrow(), action)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns a flat map of moduleName -> {canView, canCreate, canEdit, canDelete,
     * canHistory}
     * for the currently authenticated user.
     *
     * isAdmin reflects the JHipster ROLE_ADMIN (used only by the frontend to know
     * whether /api/admin/** calls are allowed). It does NOT grant module access.
     * isSuperAdmin reflects the profile flag in DB — this grants full module
     * access.
     */
    public UserPermissionsDTO getCurrentUserPermissions() {
        Optional<String> login = SecurityUtils.getCurrentUserLogin();

        UserPermissionsDTO dto = new UserPermissionsDTO();

        // Reflect ROLE_ADMIN purely for information — frontend uses it only for
        // knowing if /api/admin/** is accessible, NOT for module-level authorization.
        boolean isJhipsterAdmin = SecurityUtils.hasCurrentUserThisAuthority("ROLE_ADMIN");
        dto.setAdmin(isJhipsterAdmin);

        if (login.isEmpty()) return dto;

        List<Profile> profiles = profileRepository.findActiveProfilesByUserLogin(login.orElseThrow());
        boolean isSuperAdmin = profiles.stream().anyMatch(p -> Boolean.TRUE.equals(p.getIsSuperAdmin()));
        dto.setSuperAdmin(isSuperAdmin);

        // Always load module permissions from DB regardless of ROLE_ADMIN
        if (!isSuperAdmin) {
            List<Long> profileIds = profiles.stream().map(Profile::getId).collect(Collectors.toList());
            List<ModulePermission> permissions = modulePermissionRepository.findByProfileIdIn(profileIds);

            Map<String, UserPermissionsDTO.ModuleAccess> accessMap = new LinkedHashMap<>();
            for (ModulePermission mp : permissions) {
                if (mp.getModule() == null) continue;
                String name = mp.getModule().getNombre();
                accessMap.merge(name, toAccess(mp), UserPermissionsDTO.ModuleAccess::merge);
            }
            dto.setModules(accessMap);
        }

        return dto;
    }

    private boolean checkAction(ModulePermission perm, String action) {
        return switch (action.toLowerCase()) {
            case "view" -> Boolean.TRUE.equals(perm.getCanView());
            case "create" -> Boolean.TRUE.equals(perm.getCanCreate());
            case "edit" -> Boolean.TRUE.equals(perm.getCanEdit());
            case "delete" -> Boolean.TRUE.equals(perm.getCanDelete());
            case "history" -> Boolean.TRUE.equals(perm.getCanHistory());
            default -> false;
        };
    }

    private UserPermissionsDTO.ModuleAccess toAccess(ModulePermission mp) {
        UserPermissionsDTO.ModuleAccess a = new UserPermissionsDTO.ModuleAccess();
        a.setCanView(Boolean.TRUE.equals(mp.getCanView()));
        a.setCanCreate(Boolean.TRUE.equals(mp.getCanCreate()));
        a.setCanEdit(Boolean.TRUE.equals(mp.getCanEdit()));
        a.setCanDelete(Boolean.TRUE.equals(mp.getCanDelete()));
        a.setCanHistory(Boolean.TRUE.equals(mp.getCanHistory()));
        return a;
    }
}
