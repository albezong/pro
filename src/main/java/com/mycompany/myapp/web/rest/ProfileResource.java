package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.ProfileRepository;
import com.mycompany.myapp.service.PermissionService;
import com.mycompany.myapp.service.ProfileQueryService;
import com.mycompany.myapp.service.ProfileService;
import com.mycompany.myapp.service.criteria.ProfileCriteria;
import com.mycompany.myapp.service.dto.ProfileDTO;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Profile}.
 * Access is controlled by the custom PermissionService (module: "Perfil").
 * ROLE_ADMIN does NOT bypass these checks.
 */
@RestController
@RequestMapping("/api/profiles")
public class ProfileResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProfileResource.class);
    private static final String ENTITY_NAME = "profile";
    private static final String MODULE = "Perfil";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProfileService profileService;
    private final ProfileRepository profileRepository;
    private final ProfileQueryService profileQueryService;
    private final PermissionService permissionService;

    public ProfileResource(
        ProfileService profileService,
        ProfileRepository profileRepository,
        ProfileQueryService profileQueryService,
        PermissionService permissionService
    ) {
        this.profileService = profileService;
        this.profileRepository = profileRepository;
        this.profileQueryService = profileQueryService;
        this.permissionService = permissionService;
    }

    @PostMapping("")
    public ResponseEntity<ProfileDTO> createProfile(@Valid @RequestBody ProfileDTO profileDTO) throws URISyntaxException {
        LOG.debug("REST request to save Profile : {}", profileDTO);
        if (!permissionService.hasPermission(MODULE, "create")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (profileDTO.getId() != null) {
            throw new BadRequestAlertException("A new profile cannot already have an ID", ENTITY_NAME, "idexists");
        }
        profileDTO = profileService.save(profileDTO);
        return ResponseEntity.created(new URI("/api/profiles/" + profileDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, profileDTO.getId().toString()))
            .body(profileDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfileDTO> updateProfile(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProfileDTO profileDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Profile : {}, {}", id, profileDTO);
        if (!permissionService.hasPermission(MODULE, "edit")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (profileDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, profileDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!profileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        profileDTO = profileService.update(profileDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, profileDTO.getId().toString()))
            .body(profileDTO);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProfileDTO> partialUpdateProfile(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProfileDTO profileDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Profile partially : {}, {}", id, profileDTO);
        if (!permissionService.hasPermission(MODULE, "edit")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (profileDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, profileDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!profileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        Optional<ProfileDTO> result = profileService.partialUpdate(profileDTO);
        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, profileDTO.getId().toString())
        );
    }

    @GetMapping("")
    public ResponseEntity<List<ProfileDTO>> getAllProfiles(
        ProfileCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get Profiles by criteria: {}", criteria);
        if (!permissionService.hasPermission(MODULE, "view")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Page<ProfileDTO> page = profileQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countProfiles(ProfileCriteria criteria) {
        LOG.debug("REST request to count Profiles by criteria: {}", criteria);
        if (!permissionService.hasPermission(MODULE, "view")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok().body(profileQueryService.countByCriteria(criteria));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfileDTO> getProfile(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Profile : {}", id);
        if (!permissionService.hasPermission(MODULE, "view")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Optional<ProfileDTO> profileDTO = profileService.findOne(id);
        return ResponseUtil.wrapOrNotFound(profileDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Profile : {}", id);
        if (!permissionService.hasPermission(MODULE, "delete")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        profileService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
