package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ModulePermissionAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ModulePermission;
import com.mycompany.myapp.domain.Modules;
import com.mycompany.myapp.domain.Profile;
import com.mycompany.myapp.repository.ModulePermissionRepository;
import com.mycompany.myapp.service.ModulePermissionService;
import com.mycompany.myapp.service.dto.ModulePermissionDTO;
import com.mycompany.myapp.service.mapper.ModulePermissionMapper;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ModulePermissionResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ModulePermissionResourceIT {

    private static final Boolean DEFAULT_CAN_CREATE = false;
    private static final Boolean UPDATED_CAN_CREATE = true;

    private static final Boolean DEFAULT_CAN_EDIT = false;
    private static final Boolean UPDATED_CAN_EDIT = true;

    private static final Boolean DEFAULT_CAN_DELETE = false;
    private static final Boolean UPDATED_CAN_DELETE = true;

    private static final Boolean DEFAULT_CAN_VIEW = false;
    private static final Boolean UPDATED_CAN_VIEW = true;

    private static final Boolean DEFAULT_CAN_HISTORY = false;
    private static final Boolean UPDATED_CAN_HISTORY = true;

    private static final String ENTITY_API_URL = "/api/module-permissions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ModulePermissionRepository modulePermissionRepository;

    @Mock
    private ModulePermissionRepository modulePermissionRepositoryMock;

    @Autowired
    private ModulePermissionMapper modulePermissionMapper;

    @Mock
    private ModulePermissionService modulePermissionServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restModulePermissionMockMvc;

    private ModulePermission modulePermission;

    private ModulePermission insertedModulePermission;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ModulePermission createEntity() {
        return new ModulePermission()
            .canCreate(DEFAULT_CAN_CREATE)
            .canEdit(DEFAULT_CAN_EDIT)
            .canDelete(DEFAULT_CAN_DELETE)
            .canView(DEFAULT_CAN_VIEW)
            .canHistory(DEFAULT_CAN_HISTORY);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ModulePermission createUpdatedEntity() {
        return new ModulePermission()
            .canCreate(UPDATED_CAN_CREATE)
            .canEdit(UPDATED_CAN_EDIT)
            .canDelete(UPDATED_CAN_DELETE)
            .canView(UPDATED_CAN_VIEW)
            .canHistory(UPDATED_CAN_HISTORY);
    }

    @BeforeEach
    void initTest() {
        modulePermission = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedModulePermission != null) {
            modulePermissionRepository.delete(insertedModulePermission);
            insertedModulePermission = null;
        }
    }

    @Test
    @Transactional
    void createModulePermission() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ModulePermission
        ModulePermissionDTO modulePermissionDTO = modulePermissionMapper.toDto(modulePermission);
        var returnedModulePermissionDTO = om.readValue(
            restModulePermissionMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(modulePermissionDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ModulePermissionDTO.class
        );

        // Validate the ModulePermission in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedModulePermission = modulePermissionMapper.toEntity(returnedModulePermissionDTO);
        assertModulePermissionUpdatableFieldsEquals(returnedModulePermission, getPersistedModulePermission(returnedModulePermission));

        insertedModulePermission = returnedModulePermission;
    }

    @Test
    @Transactional
    void createModulePermissionWithExistingId() throws Exception {
        // Create the ModulePermission with an existing ID
        modulePermission.setId(1L);
        ModulePermissionDTO modulePermissionDTO = modulePermissionMapper.toDto(modulePermission);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restModulePermissionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(modulePermissionDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ModulePermission in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllModulePermissions() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList
        restModulePermissionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(modulePermission.getId().intValue())))
            .andExpect(jsonPath("$.[*].canCreate").value(hasItem(DEFAULT_CAN_CREATE)))
            .andExpect(jsonPath("$.[*].canEdit").value(hasItem(DEFAULT_CAN_EDIT)))
            .andExpect(jsonPath("$.[*].canDelete").value(hasItem(DEFAULT_CAN_DELETE)))
            .andExpect(jsonPath("$.[*].canView").value(hasItem(DEFAULT_CAN_VIEW)))
            .andExpect(jsonPath("$.[*].canHistory").value(hasItem(DEFAULT_CAN_HISTORY)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllModulePermissionsWithEagerRelationshipsIsEnabled() throws Exception {
        when(modulePermissionServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restModulePermissionMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(modulePermissionServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllModulePermissionsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(modulePermissionServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restModulePermissionMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(modulePermissionRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getModulePermission() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get the modulePermission
        restModulePermissionMockMvc
            .perform(get(ENTITY_API_URL_ID, modulePermission.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(modulePermission.getId().intValue()))
            .andExpect(jsonPath("$.canCreate").value(DEFAULT_CAN_CREATE))
            .andExpect(jsonPath("$.canEdit").value(DEFAULT_CAN_EDIT))
            .andExpect(jsonPath("$.canDelete").value(DEFAULT_CAN_DELETE))
            .andExpect(jsonPath("$.canView").value(DEFAULT_CAN_VIEW))
            .andExpect(jsonPath("$.canHistory").value(DEFAULT_CAN_HISTORY));
    }

    @Test
    @Transactional
    void getModulePermissionsByIdFiltering() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        Long id = modulePermission.getId();

        defaultModulePermissionFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultModulePermissionFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultModulePermissionFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllModulePermissionsByCanCreateIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList where canCreate equals to
        defaultModulePermissionFiltering("canCreate.equals=" + DEFAULT_CAN_CREATE, "canCreate.equals=" + UPDATED_CAN_CREATE);
    }

    @Test
    @Transactional
    void getAllModulePermissionsByCanCreateIsInShouldWork() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList where canCreate in
        defaultModulePermissionFiltering(
            "canCreate.in=" + DEFAULT_CAN_CREATE + "," + UPDATED_CAN_CREATE,
            "canCreate.in=" + UPDATED_CAN_CREATE
        );
    }

    @Test
    @Transactional
    void getAllModulePermissionsByCanCreateIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList where canCreate is not null
        defaultModulePermissionFiltering("canCreate.specified=true", "canCreate.specified=false");
    }

    @Test
    @Transactional
    void getAllModulePermissionsByCanEditIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList where canEdit equals to
        defaultModulePermissionFiltering("canEdit.equals=" + DEFAULT_CAN_EDIT, "canEdit.equals=" + UPDATED_CAN_EDIT);
    }

    @Test
    @Transactional
    void getAllModulePermissionsByCanEditIsInShouldWork() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList where canEdit in
        defaultModulePermissionFiltering("canEdit.in=" + DEFAULT_CAN_EDIT + "," + UPDATED_CAN_EDIT, "canEdit.in=" + UPDATED_CAN_EDIT);
    }

    @Test
    @Transactional
    void getAllModulePermissionsByCanEditIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList where canEdit is not null
        defaultModulePermissionFiltering("canEdit.specified=true", "canEdit.specified=false");
    }

    @Test
    @Transactional
    void getAllModulePermissionsByCanDeleteIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList where canDelete equals to
        defaultModulePermissionFiltering("canDelete.equals=" + DEFAULT_CAN_DELETE, "canDelete.equals=" + UPDATED_CAN_DELETE);
    }

    @Test
    @Transactional
    void getAllModulePermissionsByCanDeleteIsInShouldWork() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList where canDelete in
        defaultModulePermissionFiltering(
            "canDelete.in=" + DEFAULT_CAN_DELETE + "," + UPDATED_CAN_DELETE,
            "canDelete.in=" + UPDATED_CAN_DELETE
        );
    }

    @Test
    @Transactional
    void getAllModulePermissionsByCanDeleteIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList where canDelete is not null
        defaultModulePermissionFiltering("canDelete.specified=true", "canDelete.specified=false");
    }

    @Test
    @Transactional
    void getAllModulePermissionsByCanViewIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList where canView equals to
        defaultModulePermissionFiltering("canView.equals=" + DEFAULT_CAN_VIEW, "canView.equals=" + UPDATED_CAN_VIEW);
    }

    @Test
    @Transactional
    void getAllModulePermissionsByCanViewIsInShouldWork() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList where canView in
        defaultModulePermissionFiltering("canView.in=" + DEFAULT_CAN_VIEW + "," + UPDATED_CAN_VIEW, "canView.in=" + UPDATED_CAN_VIEW);
    }

    @Test
    @Transactional
    void getAllModulePermissionsByCanViewIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList where canView is not null
        defaultModulePermissionFiltering("canView.specified=true", "canView.specified=false");
    }

    @Test
    @Transactional
    void getAllModulePermissionsByCanHistoryIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList where canHistory equals to
        defaultModulePermissionFiltering("canHistory.equals=" + DEFAULT_CAN_HISTORY, "canHistory.equals=" + UPDATED_CAN_HISTORY);
    }

    @Test
    @Transactional
    void getAllModulePermissionsByCanHistoryIsInShouldWork() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList where canHistory in
        defaultModulePermissionFiltering(
            "canHistory.in=" + DEFAULT_CAN_HISTORY + "," + UPDATED_CAN_HISTORY,
            "canHistory.in=" + UPDATED_CAN_HISTORY
        );
    }

    @Test
    @Transactional
    void getAllModulePermissionsByCanHistoryIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        // Get all the modulePermissionList where canHistory is not null
        defaultModulePermissionFiltering("canHistory.specified=true", "canHistory.specified=false");
    }

    @Test
    @Transactional
    void getAllModulePermissionsByModuleIsEqualToSomething() throws Exception {
        Modules module;
        if (TestUtil.findAll(em, Modules.class).isEmpty()) {
            modulePermissionRepository.saveAndFlush(modulePermission);
            module = ModulesResourceIT.createEntity();
        } else {
            module = TestUtil.findAll(em, Modules.class).get(0);
        }
        em.persist(module);
        em.flush();
        modulePermission.setModule(module);
        modulePermissionRepository.saveAndFlush(modulePermission);
        Long moduleId = module.getId();
        // Get all the modulePermissionList where module equals to moduleId
        defaultModulePermissionShouldBeFound("moduleId.equals=" + moduleId);

        // Get all the modulePermissionList where module equals to (moduleId + 1)
        defaultModulePermissionShouldNotBeFound("moduleId.equals=" + (moduleId + 1));
    }

    @Test
    @Transactional
    void getAllModulePermissionsByProfileIsEqualToSomething() throws Exception {
        Profile profile;
        if (TestUtil.findAll(em, Profile.class).isEmpty()) {
            modulePermissionRepository.saveAndFlush(modulePermission);
            profile = ProfileResourceIT.createEntity();
        } else {
            profile = TestUtil.findAll(em, Profile.class).get(0);
        }
        em.persist(profile);
        em.flush();
        modulePermission.setProfile(profile);
        modulePermissionRepository.saveAndFlush(modulePermission);
        Long profileId = profile.getId();
        // Get all the modulePermissionList where profile equals to profileId
        defaultModulePermissionShouldBeFound("profileId.equals=" + profileId);

        // Get all the modulePermissionList where profile equals to (profileId + 1)
        defaultModulePermissionShouldNotBeFound("profileId.equals=" + (profileId + 1));
    }

    private void defaultModulePermissionFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultModulePermissionShouldBeFound(shouldBeFound);
        defaultModulePermissionShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultModulePermissionShouldBeFound(String filter) throws Exception {
        restModulePermissionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(modulePermission.getId().intValue())))
            .andExpect(jsonPath("$.[*].canCreate").value(hasItem(DEFAULT_CAN_CREATE)))
            .andExpect(jsonPath("$.[*].canEdit").value(hasItem(DEFAULT_CAN_EDIT)))
            .andExpect(jsonPath("$.[*].canDelete").value(hasItem(DEFAULT_CAN_DELETE)))
            .andExpect(jsonPath("$.[*].canView").value(hasItem(DEFAULT_CAN_VIEW)))
            .andExpect(jsonPath("$.[*].canHistory").value(hasItem(DEFAULT_CAN_HISTORY)));

        // Check, that the count call also returns 1
        restModulePermissionMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultModulePermissionShouldNotBeFound(String filter) throws Exception {
        restModulePermissionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restModulePermissionMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingModulePermission() throws Exception {
        // Get the modulePermission
        restModulePermissionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingModulePermission() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the modulePermission
        ModulePermission updatedModulePermission = modulePermissionRepository.findById(modulePermission.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedModulePermission are not directly saved in db
        em.detach(updatedModulePermission);
        updatedModulePermission
            .canCreate(UPDATED_CAN_CREATE)
            .canEdit(UPDATED_CAN_EDIT)
            .canDelete(UPDATED_CAN_DELETE)
            .canView(UPDATED_CAN_VIEW)
            .canHistory(UPDATED_CAN_HISTORY);
        ModulePermissionDTO modulePermissionDTO = modulePermissionMapper.toDto(updatedModulePermission);

        restModulePermissionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, modulePermissionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(modulePermissionDTO))
            )
            .andExpect(status().isOk());

        // Validate the ModulePermission in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedModulePermissionToMatchAllProperties(updatedModulePermission);
    }

    @Test
    @Transactional
    void putNonExistingModulePermission() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        modulePermission.setId(longCount.incrementAndGet());

        // Create the ModulePermission
        ModulePermissionDTO modulePermissionDTO = modulePermissionMapper.toDto(modulePermission);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restModulePermissionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, modulePermissionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(modulePermissionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ModulePermission in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchModulePermission() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        modulePermission.setId(longCount.incrementAndGet());

        // Create the ModulePermission
        ModulePermissionDTO modulePermissionDTO = modulePermissionMapper.toDto(modulePermission);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModulePermissionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(modulePermissionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ModulePermission in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamModulePermission() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        modulePermission.setId(longCount.incrementAndGet());

        // Create the ModulePermission
        ModulePermissionDTO modulePermissionDTO = modulePermissionMapper.toDto(modulePermission);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModulePermissionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(modulePermissionDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ModulePermission in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateModulePermissionWithPatch() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the modulePermission using partial update
        ModulePermission partialUpdatedModulePermission = new ModulePermission();
        partialUpdatedModulePermission.setId(modulePermission.getId());

        partialUpdatedModulePermission.canCreate(UPDATED_CAN_CREATE).canDelete(UPDATED_CAN_DELETE).canHistory(UPDATED_CAN_HISTORY);

        restModulePermissionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedModulePermission.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedModulePermission))
            )
            .andExpect(status().isOk());

        // Validate the ModulePermission in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertModulePermissionUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedModulePermission, modulePermission),
            getPersistedModulePermission(modulePermission)
        );
    }

    @Test
    @Transactional
    void fullUpdateModulePermissionWithPatch() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the modulePermission using partial update
        ModulePermission partialUpdatedModulePermission = new ModulePermission();
        partialUpdatedModulePermission.setId(modulePermission.getId());

        partialUpdatedModulePermission
            .canCreate(UPDATED_CAN_CREATE)
            .canEdit(UPDATED_CAN_EDIT)
            .canDelete(UPDATED_CAN_DELETE)
            .canView(UPDATED_CAN_VIEW)
            .canHistory(UPDATED_CAN_HISTORY);

        restModulePermissionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedModulePermission.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedModulePermission))
            )
            .andExpect(status().isOk());

        // Validate the ModulePermission in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertModulePermissionUpdatableFieldsEquals(
            partialUpdatedModulePermission,
            getPersistedModulePermission(partialUpdatedModulePermission)
        );
    }

    @Test
    @Transactional
    void patchNonExistingModulePermission() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        modulePermission.setId(longCount.incrementAndGet());

        // Create the ModulePermission
        ModulePermissionDTO modulePermissionDTO = modulePermissionMapper.toDto(modulePermission);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restModulePermissionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, modulePermissionDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(modulePermissionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ModulePermission in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchModulePermission() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        modulePermission.setId(longCount.incrementAndGet());

        // Create the ModulePermission
        ModulePermissionDTO modulePermissionDTO = modulePermissionMapper.toDto(modulePermission);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModulePermissionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(modulePermissionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ModulePermission in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamModulePermission() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        modulePermission.setId(longCount.incrementAndGet());

        // Create the ModulePermission
        ModulePermissionDTO modulePermissionDTO = modulePermissionMapper.toDto(modulePermission);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModulePermissionMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(modulePermissionDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ModulePermission in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteModulePermission() throws Exception {
        // Initialize the database
        insertedModulePermission = modulePermissionRepository.saveAndFlush(modulePermission);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the modulePermission
        restModulePermissionMockMvc
            .perform(delete(ENTITY_API_URL_ID, modulePermission.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return modulePermissionRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected ModulePermission getPersistedModulePermission(ModulePermission modulePermission) {
        return modulePermissionRepository.findById(modulePermission.getId()).orElseThrow();
    }

    protected void assertPersistedModulePermissionToMatchAllProperties(ModulePermission expectedModulePermission) {
        assertModulePermissionAllPropertiesEquals(expectedModulePermission, getPersistedModulePermission(expectedModulePermission));
    }

    protected void assertPersistedModulePermissionToMatchUpdatableProperties(ModulePermission expectedModulePermission) {
        assertModulePermissionAllUpdatablePropertiesEquals(
            expectedModulePermission,
            getPersistedModulePermission(expectedModulePermission)
        );
    }
}
