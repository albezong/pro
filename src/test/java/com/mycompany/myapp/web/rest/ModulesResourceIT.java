package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ModulesAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Modules;
import com.mycompany.myapp.repository.ModulesRepository;
import com.mycompany.myapp.service.dto.ModulesDTO;
import com.mycompany.myapp.service.mapper.ModulesMapper;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ModulesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ModulesResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_FECHA_CREACION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FECHA_CREACION = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_FECHA_CREACION = LocalDate.ofEpochDay(-1L);

    private static final String ENTITY_API_URL = "/api/modules";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ModulesRepository modulesRepository;

    @Autowired
    private ModulesMapper modulesMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restModulesMockMvc;

    private Modules modules;

    private Modules insertedModules;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Modules createEntity() {
        return new Modules().nombre(DEFAULT_NOMBRE).fechaCreacion(DEFAULT_FECHA_CREACION);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Modules createUpdatedEntity() {
        return new Modules().nombre(UPDATED_NOMBRE).fechaCreacion(UPDATED_FECHA_CREACION);
    }

    @BeforeEach
    void initTest() {
        modules = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedModules != null) {
            modulesRepository.delete(insertedModules);
            insertedModules = null;
        }
    }

    @Test
    @Transactional
    void createModules() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Modules
        ModulesDTO modulesDTO = modulesMapper.toDto(modules);
        var returnedModulesDTO = om.readValue(
            restModulesMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(modulesDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ModulesDTO.class
        );

        // Validate the Modules in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedModules = modulesMapper.toEntity(returnedModulesDTO);
        assertModulesUpdatableFieldsEquals(returnedModules, getPersistedModules(returnedModules));

        insertedModules = returnedModules;
    }

    @Test
    @Transactional
    void createModulesWithExistingId() throws Exception {
        // Create the Modules with an existing ID
        modules.setId(1L);
        ModulesDTO modulesDTO = modulesMapper.toDto(modules);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restModulesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(modulesDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Modules in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        modules.setNombre(null);

        // Create the Modules, which fails.
        ModulesDTO modulesDTO = modulesMapper.toDto(modules);

        restModulesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(modulesDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllModules() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        // Get all the modulesList
        restModulesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(modules.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].fechaCreacion").value(hasItem(DEFAULT_FECHA_CREACION.toString())));
    }

    @Test
    @Transactional
    void getModules() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        // Get the modules
        restModulesMockMvc
            .perform(get(ENTITY_API_URL_ID, modules.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(modules.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.fechaCreacion").value(DEFAULT_FECHA_CREACION.toString()));
    }

    @Test
    @Transactional
    void getModulesByIdFiltering() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        Long id = modules.getId();

        defaultModulesFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultModulesFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultModulesFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllModulesByNombreIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        // Get all the modulesList where nombre equals to
        defaultModulesFiltering("nombre.equals=" + DEFAULT_NOMBRE, "nombre.equals=" + UPDATED_NOMBRE);
    }

    @Test
    @Transactional
    void getAllModulesByNombreIsInShouldWork() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        // Get all the modulesList where nombre in
        defaultModulesFiltering("nombre.in=" + DEFAULT_NOMBRE + "," + UPDATED_NOMBRE, "nombre.in=" + UPDATED_NOMBRE);
    }

    @Test
    @Transactional
    void getAllModulesByNombreIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        // Get all the modulesList where nombre is not null
        defaultModulesFiltering("nombre.specified=true", "nombre.specified=false");
    }

    @Test
    @Transactional
    void getAllModulesByNombreContainsSomething() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        // Get all the modulesList where nombre contains
        defaultModulesFiltering("nombre.contains=" + DEFAULT_NOMBRE, "nombre.contains=" + UPDATED_NOMBRE);
    }

    @Test
    @Transactional
    void getAllModulesByNombreNotContainsSomething() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        // Get all the modulesList where nombre does not contain
        defaultModulesFiltering("nombre.doesNotContain=" + UPDATED_NOMBRE, "nombre.doesNotContain=" + DEFAULT_NOMBRE);
    }

    @Test
    @Transactional
    void getAllModulesByFechaCreacionIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        // Get all the modulesList where fechaCreacion equals to
        defaultModulesFiltering("fechaCreacion.equals=" + DEFAULT_FECHA_CREACION, "fechaCreacion.equals=" + UPDATED_FECHA_CREACION);
    }

    @Test
    @Transactional
    void getAllModulesByFechaCreacionIsInShouldWork() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        // Get all the modulesList where fechaCreacion in
        defaultModulesFiltering(
            "fechaCreacion.in=" + DEFAULT_FECHA_CREACION + "," + UPDATED_FECHA_CREACION,
            "fechaCreacion.in=" + UPDATED_FECHA_CREACION
        );
    }

    @Test
    @Transactional
    void getAllModulesByFechaCreacionIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        // Get all the modulesList where fechaCreacion is not null
        defaultModulesFiltering("fechaCreacion.specified=true", "fechaCreacion.specified=false");
    }

    @Test
    @Transactional
    void getAllModulesByFechaCreacionIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        // Get all the modulesList where fechaCreacion is greater than or equal to
        defaultModulesFiltering(
            "fechaCreacion.greaterThanOrEqual=" + DEFAULT_FECHA_CREACION,
            "fechaCreacion.greaterThanOrEqual=" + UPDATED_FECHA_CREACION
        );
    }

    @Test
    @Transactional
    void getAllModulesByFechaCreacionIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        // Get all the modulesList where fechaCreacion is less than or equal to
        defaultModulesFiltering(
            "fechaCreacion.lessThanOrEqual=" + DEFAULT_FECHA_CREACION,
            "fechaCreacion.lessThanOrEqual=" + SMALLER_FECHA_CREACION
        );
    }

    @Test
    @Transactional
    void getAllModulesByFechaCreacionIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        // Get all the modulesList where fechaCreacion is less than
        defaultModulesFiltering("fechaCreacion.lessThan=" + UPDATED_FECHA_CREACION, "fechaCreacion.lessThan=" + DEFAULT_FECHA_CREACION);
    }

    @Test
    @Transactional
    void getAllModulesByFechaCreacionIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        // Get all the modulesList where fechaCreacion is greater than
        defaultModulesFiltering(
            "fechaCreacion.greaterThan=" + SMALLER_FECHA_CREACION,
            "fechaCreacion.greaterThan=" + DEFAULT_FECHA_CREACION
        );
    }

    private void defaultModulesFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultModulesShouldBeFound(shouldBeFound);
        defaultModulesShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultModulesShouldBeFound(String filter) throws Exception {
        restModulesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(modules.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].fechaCreacion").value(hasItem(DEFAULT_FECHA_CREACION.toString())));

        // Check, that the count call also returns 1
        restModulesMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultModulesShouldNotBeFound(String filter) throws Exception {
        restModulesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restModulesMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingModules() throws Exception {
        // Get the modules
        restModulesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingModules() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the modules
        Modules updatedModules = modulesRepository.findById(modules.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedModules are not directly saved in db
        em.detach(updatedModules);
        updatedModules.nombre(UPDATED_NOMBRE).fechaCreacion(UPDATED_FECHA_CREACION);
        ModulesDTO modulesDTO = modulesMapper.toDto(updatedModules);

        restModulesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, modulesDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(modulesDTO))
            )
            .andExpect(status().isOk());

        // Validate the Modules in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedModulesToMatchAllProperties(updatedModules);
    }

    @Test
    @Transactional
    void putNonExistingModules() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        modules.setId(longCount.incrementAndGet());

        // Create the Modules
        ModulesDTO modulesDTO = modulesMapper.toDto(modules);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restModulesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, modulesDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(modulesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Modules in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchModules() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        modules.setId(longCount.incrementAndGet());

        // Create the Modules
        ModulesDTO modulesDTO = modulesMapper.toDto(modules);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModulesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(modulesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Modules in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamModules() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        modules.setId(longCount.incrementAndGet());

        // Create the Modules
        ModulesDTO modulesDTO = modulesMapper.toDto(modules);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModulesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(modulesDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Modules in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateModulesWithPatch() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the modules using partial update
        Modules partialUpdatedModules = new Modules();
        partialUpdatedModules.setId(modules.getId());

        partialUpdatedModules.fechaCreacion(UPDATED_FECHA_CREACION);

        restModulesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedModules.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedModules))
            )
            .andExpect(status().isOk());

        // Validate the Modules in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertModulesUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedModules, modules), getPersistedModules(modules));
    }

    @Test
    @Transactional
    void fullUpdateModulesWithPatch() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the modules using partial update
        Modules partialUpdatedModules = new Modules();
        partialUpdatedModules.setId(modules.getId());

        partialUpdatedModules.nombre(UPDATED_NOMBRE).fechaCreacion(UPDATED_FECHA_CREACION);

        restModulesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedModules.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedModules))
            )
            .andExpect(status().isOk());

        // Validate the Modules in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertModulesUpdatableFieldsEquals(partialUpdatedModules, getPersistedModules(partialUpdatedModules));
    }

    @Test
    @Transactional
    void patchNonExistingModules() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        modules.setId(longCount.incrementAndGet());

        // Create the Modules
        ModulesDTO modulesDTO = modulesMapper.toDto(modules);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restModulesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, modulesDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(modulesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Modules in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchModules() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        modules.setId(longCount.incrementAndGet());

        // Create the Modules
        ModulesDTO modulesDTO = modulesMapper.toDto(modules);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModulesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(modulesDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Modules in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamModules() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        modules.setId(longCount.incrementAndGet());

        // Create the Modules
        ModulesDTO modulesDTO = modulesMapper.toDto(modules);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModulesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(modulesDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Modules in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteModules() throws Exception {
        // Initialize the database
        insertedModules = modulesRepository.saveAndFlush(modules);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the modules
        restModulesMockMvc
            .perform(delete(ENTITY_API_URL_ID, modules.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return modulesRepository.count();
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

    protected Modules getPersistedModules(Modules modules) {
        return modulesRepository.findById(modules.getId()).orElseThrow();
    }

    protected void assertPersistedModulesToMatchAllProperties(Modules expectedModules) {
        assertModulesAllPropertiesEquals(expectedModules, getPersistedModules(expectedModules));
    }

    protected void assertPersistedModulesToMatchUpdatableProperties(Modules expectedModules) {
        assertModulesAllUpdatablePropertiesEquals(expectedModules, getPersistedModules(expectedModules));
    }
}
