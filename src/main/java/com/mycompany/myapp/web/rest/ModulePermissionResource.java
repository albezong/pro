package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.ModulePermissionRepository;
import com.mycompany.myapp.service.ModulePermissionQueryService;
import com.mycompany.myapp.service.ModulePermissionService;
import com.mycompany.myapp.service.PermissionService;
import com.mycompany.myapp.service.criteria.ModulePermissionCriteria;
import com.mycompany.myapp.service.dto.ModulePermissionDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.ModulePermission}.
 * Access is controlled by the custom PermissionService (module: "PermisosPerfil").
 * ROLE_ADMIN does NOT bypass these checks.
 */
@RestController
@RequestMapping("/api/module-permissions")
public class ModulePermissionResource {

    private static final Logger LOG = LoggerFactory.getLogger(ModulePermissionResource.class);
    private static final String ENTITY_NAME = "modulePermission";
    private static final String MODULE = "Permisos";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ModulePermissionService modulePermissionService;
    private final ModulePermissionRepository modulePermissionRepository;
    private final ModulePermissionQueryService modulePermissionQueryService;
    private final PermissionService permissionService;

    public ModulePermissionResource(
        ModulePermissionService modulePermissionService,
        ModulePermissionRepository modulePermissionRepository,
        ModulePermissionQueryService modulePermissionQueryService,
        PermissionService permissionService
    ) {
        this.modulePermissionService = modulePermissionService;
        this.modulePermissionRepository = modulePermissionRepository;
        this.modulePermissionQueryService = modulePermissionQueryService;
        this.permissionService = permissionService;
    }

    @PostMapping("")
    public ResponseEntity<ModulePermissionDTO> createModulePermission(@RequestBody ModulePermissionDTO modulePermissionDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save ModulePermission : {}", modulePermissionDTO);
        if (!permissionService.hasPermission(MODULE, "create")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (modulePermissionDTO.getId() != null) {
            throw new BadRequestAlertException("A new modulePermission cannot already have an ID", ENTITY_NAME, "idexists");
        }
        modulePermissionDTO = modulePermissionService.save(modulePermissionDTO);
        return ResponseEntity.created(new URI("/api/module-permissions/" + modulePermissionDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, modulePermissionDTO.getId().toString()))
            .body(modulePermissionDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ModulePermissionDTO> updateModulePermission(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ModulePermissionDTO modulePermissionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ModulePermission : {}, {}", id, modulePermissionDTO);
        if (!permissionService.hasPermission(MODULE, "edit")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (modulePermissionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, modulePermissionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!modulePermissionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        modulePermissionDTO = modulePermissionService.update(modulePermissionDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, modulePermissionDTO.getId().toString()))
            .body(modulePermissionDTO);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ModulePermissionDTO> partialUpdateModulePermission(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ModulePermissionDTO modulePermissionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ModulePermission partially : {}, {}", id, modulePermissionDTO);
        if (!permissionService.hasPermission(MODULE, "edit")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (modulePermissionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, modulePermissionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!modulePermissionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        Optional<ModulePermissionDTO> result = modulePermissionService.partialUpdate(modulePermissionDTO);
        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, modulePermissionDTO.getId().toString())
        );
    }

    @GetMapping("")
    public ResponseEntity<List<ModulePermissionDTO>> getAllModulePermissions(
        ModulePermissionCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get ModulePermissions by criteria: {}", criteria);
        if (!permissionService.hasPermission(MODULE, "view")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Page<ModulePermissionDTO> page = modulePermissionQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countModulePermissions(ModulePermissionCriteria criteria) {
        LOG.debug("REST request to count ModulePermissions by criteria: {}", criteria);
        if (!permissionService.hasPermission(MODULE, "view")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok().body(modulePermissionQueryService.countByCriteria(criteria));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModulePermissionDTO> getModulePermission(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ModulePermission : {}", id);
        if (!permissionService.hasPermission(MODULE, "view")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Optional<ModulePermissionDTO> modulePermissionDTO = modulePermissionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(modulePermissionDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModulePermission(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ModulePermission : {}", id);
        if (!permissionService.hasPermission(MODULE, "delete")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        modulePermissionService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
