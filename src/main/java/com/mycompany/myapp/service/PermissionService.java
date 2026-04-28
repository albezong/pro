package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.ModulePermission;
import com.mycompany.myapp.domain.Profile;
import com.mycompany.myapp.repository.ModulePermissionRepository;
import com.mycompany.myapp.repository.ProfileRepository;
import com.mycompany.myapp.security.AuthoritiesConstants;
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
 * ADMINs always have full access. Non-admins are evaluated against the DB.
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
     * Checks if the currently authenticated user has the given action on the given module.
     */
    public boolean hasPermission(String moduleName, String action) {
        if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            return true;
        }
        Optional<String> login = SecurityUtils.getCurrentUserLogin();
        if (login.isEmpty()) return false;
        return hasPermissionForUser(login.get(), moduleName, action);
    }

    /**
     * Checks if a specific user has the given action on the given module.
     */
    public boolean hasPermissionForUser(String login, String moduleName, String action) {
        if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            return true;
        }
        List<Profile> profiles = profileRepository.findActiveProfilesByUserLogin(login);
        for (Profile profile : profiles) {
            if (Boolean.TRUE.equals(profile.getIsSuperAdmin())) return true;
            Optional<ModulePermission> perm = modulePermissionRepository.findByProfileIdAndModuleName(profile.getId(), moduleName);
            if (perm.isPresent() && checkAction(perm.get(), action)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns a flat map of moduleName -> {canView, canCreate, canEdit, canDelete}
     * for the currently authenticated user.
     */
    public UserPermissionsDTO getCurrentUserPermissions() {
        Optional<String> login = SecurityUtils.getCurrentUserLogin();
        boolean isAdmin = SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN);

        UserPermissionsDTO dto = new UserPermissionsDTO();
        dto.setAdmin(isAdmin);

        if (isAdmin || login.isEmpty()) {
            return dto;
        }

        List<Profile> profiles = profileRepository.findActiveProfilesByUserLogin(login.get());
        boolean isSuperAdmin = profiles.stream().anyMatch(p -> Boolean.TRUE.equals(p.getIsSuperAdmin()));
        dto.setSuperAdmin(isSuperAdmin);

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
