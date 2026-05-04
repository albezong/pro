package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.ModulesRepository;
import com.mycompany.myapp.service.ModulesQueryService;
import com.mycompany.myapp.service.ModulesService;
import com.mycompany.myapp.service.PermissionService;
import com.mycompany.myapp.service.criteria.ModulesCriteria;
import com.mycompany.myapp.service.dto.ModulesDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Modules}.
 * Access is controlled by the custom PermissionService (module: "Modulos").
 * ROLE_ADMIN does NOT bypass these checks.
 */
@RestController
@RequestMapping("/api/modules")
public class ModulesResource {

    private static final Logger LOG = LoggerFactory.getLogger(ModulesResource.class);
    private static final String ENTITY_NAME = "modules";
    private static final String MODULE = "Modulos";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ModulesService modulesService;
    private final ModulesRepository modulesRepository;
    private final ModulesQueryService modulesQueryService;
    private final PermissionService permissionService;

    public ModulesResource(
        ModulesService modulesService,
        ModulesRepository modulesRepository,
        ModulesQueryService modulesQueryService,
        PermissionService permissionService
    ) {
        this.modulesService = modulesService;
        this.modulesRepository = modulesRepository;
        this.modulesQueryService = modulesQueryService;
        this.permissionService = permissionService;
    }

    @PostMapping("")
    public ResponseEntity<ModulesDTO> createModules(@Valid @RequestBody ModulesDTO modulesDTO) throws URISyntaxException {
        LOG.debug("REST request to save Modules : {}", modulesDTO);
        if (!permissionService.hasPermission(MODULE, "create")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (modulesDTO.getId() != null) {
            throw new BadRequestAlertException("A new modules cannot already have an ID", ENTITY_NAME, "idexists");
        }
        modulesDTO = modulesService.save(modulesDTO);
        return ResponseEntity.created(new URI("/api/modules/" + modulesDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, modulesDTO.getId().toString()))
            .body(modulesDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ModulesDTO> updateModules(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ModulesDTO modulesDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Modules : {}, {}", id, modulesDTO);
        if (!permissionService.hasPermission(MODULE, "edit")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (modulesDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, modulesDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!modulesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        modulesDTO = modulesService.update(modulesDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, modulesDTO.getId().toString()))
            .body(modulesDTO);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ModulesDTO> partialUpdateModules(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ModulesDTO modulesDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Modules partially : {}, {}", id, modulesDTO);
        if (!permissionService.hasPermission(MODULE, "edit")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (modulesDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, modulesDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!modulesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        Optional<ModulesDTO> result = modulesService.partialUpdate(modulesDTO);
        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, modulesDTO.getId().toString())
        );
    }

    @GetMapping("")
    public ResponseEntity<List<ModulesDTO>> getAllModules(
        ModulesCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get Modules by criteria: {}", criteria);
        if (!permissionService.hasPermission(MODULE, "view")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Page<ModulesDTO> page = modulesQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countModules(ModulesCriteria criteria) {
        LOG.debug("REST request to count Modules by criteria: {}", criteria);
        if (!permissionService.hasPermission(MODULE, "view")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok().body(modulesQueryService.countByCriteria(criteria));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModulesDTO> getModules(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Modules : {}", id);
        if (!permissionService.hasPermission(MODULE, "view")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Optional<ModulesDTO> modulesDTO = modulesService.findOne(id);
        return ResponseUtil.wrapOrNotFound(modulesDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModules(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Modules : {}", id);
        if (!permissionService.hasPermission(MODULE, "delete")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        modulesService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
