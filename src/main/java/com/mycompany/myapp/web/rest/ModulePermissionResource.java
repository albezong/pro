package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.ModulePermissionRepository;
import com.mycompany.myapp.service.ModulePermissionQueryService;
import com.mycompany.myapp.service.ModulePermissionService;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.ModulePermission}.
 */
@RestController
@RequestMapping("/api/module-permissions")
public class ModulePermissionResource {

    private static final Logger LOG = LoggerFactory.getLogger(ModulePermissionResource.class);

    private static final String ENTITY_NAME = "modulePermission";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ModulePermissionService modulePermissionService;

    private final ModulePermissionRepository modulePermissionRepository;

    private final ModulePermissionQueryService modulePermissionQueryService;

    public ModulePermissionResource(
        ModulePermissionService modulePermissionService,
        ModulePermissionRepository modulePermissionRepository,
        ModulePermissionQueryService modulePermissionQueryService
    ) {
        this.modulePermissionService = modulePermissionService;
        this.modulePermissionRepository = modulePermissionRepository;
        this.modulePermissionQueryService = modulePermissionQueryService;
    }

    /**
     * {@code POST  /module-permissions} : Create a new modulePermission.
     *
     * @param modulePermissionDTO the modulePermissionDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new modulePermissionDTO, or with status {@code 400 (Bad Request)} if the modulePermission has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ModulePermissionDTO> createModulePermission(@RequestBody ModulePermissionDTO modulePermissionDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save ModulePermission : {}", modulePermissionDTO);
        if (modulePermissionDTO.getId() != null) {
            throw new BadRequestAlertException("A new modulePermission cannot already have an ID", ENTITY_NAME, "idexists");
        }
        modulePermissionDTO = modulePermissionService.save(modulePermissionDTO);
        return ResponseEntity.created(new URI("/api/module-permissions/" + modulePermissionDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, modulePermissionDTO.getId().toString()))
            .body(modulePermissionDTO);
    }

    /**
     * {@code PUT  /module-permissions/:id} : Updates an existing modulePermission.
     *
     * @param id the id of the modulePermissionDTO to save.
     * @param modulePermissionDTO the modulePermissionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated modulePermissionDTO,
     * or with status {@code 400 (Bad Request)} if the modulePermissionDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the modulePermissionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ModulePermissionDTO> updateModulePermission(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ModulePermissionDTO modulePermissionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update ModulePermission : {}, {}", id, modulePermissionDTO);
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

    /**
     * {@code PATCH  /module-permissions/:id} : Partial updates given fields of an existing modulePermission, field will ignore if it is null
     *
     * @param id the id of the modulePermissionDTO to save.
     * @param modulePermissionDTO the modulePermissionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated modulePermissionDTO,
     * or with status {@code 400 (Bad Request)} if the modulePermissionDTO is not valid,
     * or with status {@code 404 (Not Found)} if the modulePermissionDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the modulePermissionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ModulePermissionDTO> partialUpdateModulePermission(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ModulePermissionDTO modulePermissionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ModulePermission partially : {}, {}", id, modulePermissionDTO);
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

    /**
     * {@code GET  /module-permissions} : get all the modulePermissions.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of modulePermissions in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ModulePermissionDTO>> getAllModulePermissions(
        ModulePermissionCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get ModulePermissions by criteria: {}", criteria);

        Page<ModulePermissionDTO> page = modulePermissionQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /module-permissions/count} : count all the modulePermissions.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countModulePermissions(ModulePermissionCriteria criteria) {
        LOG.debug("REST request to count ModulePermissions by criteria: {}", criteria);
        return ResponseEntity.ok().body(modulePermissionQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /module-permissions/:id} : get the "id" modulePermission.
     *
     * @param id the id of the modulePermissionDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the modulePermissionDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ModulePermissionDTO> getModulePermission(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ModulePermission : {}", id);
        Optional<ModulePermissionDTO> modulePermissionDTO = modulePermissionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(modulePermissionDTO);
    }

    /**
     * {@code DELETE  /module-permissions/:id} : delete the "id" modulePermission.
     *
     * @param id the id of the modulePermissionDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModulePermission(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ModulePermission : {}", id);
        modulePermissionService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
