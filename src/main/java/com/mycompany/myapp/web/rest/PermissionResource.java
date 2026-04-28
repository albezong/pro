package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.service.PermissionService;
import com.mycompany.myapp.service.dto.UserPermissionsDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller exposing dynamic permissions for the current user.
 * GET /api/account/permissions -> returns full permission map
 */
@RestController
@RequestMapping("/api")
public class PermissionResource {

    private static final Logger LOG = LoggerFactory.getLogger(PermissionResource.class);

    private final PermissionService permissionService;

    public PermissionResource(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    /**
     * GET /api/account/permissions
     * Returns the permission map for the authenticated user.
     */
    @GetMapping("/account/permissions")
    public ResponseEntity<UserPermissionsDTO> getCurrentUserPermissions() {
        LOG.debug("REST request to get current user permissions");
        return ResponseEntity.ok(permissionService.getCurrentUserPermissions());
    }

    /**
     * GET /api/account/permissions/{module}/{action}
     * Returns true/false for a specific module+action check.
     */
    @GetMapping("/account/permissions/{module}/{action}")
    public ResponseEntity<Boolean> hasPermission(@PathVariable String module, @PathVariable String action) {
        return ResponseEntity.ok(permissionService.hasPermission(module, action));
    }
}
