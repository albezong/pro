package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Modules;
import com.mycompany.myapp.repository.ModulePermissionRepository;
import com.mycompany.myapp.repository.ModulesRepository;
import com.mycompany.myapp.service.dto.ModulesDTO;
import com.mycompany.myapp.service.mapper.ModulesMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing
 * {@link com.mycompany.myapp.domain.Modules}.
 */
@Service
@Transactional
public class ModulesService {

    private static final Logger LOG = LoggerFactory.getLogger(ModulesService.class);

    private final ModulesRepository modulesRepository;
    private final ModulesMapper modulesMapper;
    private final ModulePermissionRepository modulePermissionRepository; // <-- nuevo

    public ModulesService(
            ModulesRepository modulesRepository,
            ModulesMapper modulesMapper,
            ModulePermissionRepository modulePermissionRepository // <-- nuevo
    ) {
        this.modulesRepository = modulesRepository;
        this.modulesMapper = modulesMapper;
        this.modulePermissionRepository = modulePermissionRepository;
    }

    /**
     * Save a modules.
     *
     * @param modulesDTO the entity to save.
     * @return the persisted entity.
     */
    public ModulesDTO save(ModulesDTO modulesDTO) {
        LOG.debug("Request to save Modules : {}", modulesDTO);
        Modules modules = modulesMapper.toEntity(modulesDTO);
        modules = modulesRepository.save(modules);
        return modulesMapper.toDto(modules);
    }

    /**
     * Update a modules.
     *
     * @param modulesDTO the entity to save.
     * @return the persisted entity.
     */
    public ModulesDTO update(ModulesDTO modulesDTO) {
        LOG.debug("Request to update Modules : {}", modulesDTO);
        Modules modules = modulesMapper.toEntity(modulesDTO);
        modules = modulesRepository.save(modules);
        return modulesMapper.toDto(modules);
    }

    /**
     * Partially update a modules.
     *
     * @param modulesDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ModulesDTO> partialUpdate(ModulesDTO modulesDTO) {
        LOG.debug("Request to partially update Modules : {}", modulesDTO);

        return modulesRepository
                .findById(modulesDTO.getId())
                .map(existingModules -> {
                    modulesMapper.partialUpdate(existingModules, modulesDTO);

                    return existingModules;
                })
                .map(modulesRepository::save)
                .map(modulesMapper::toDto);
    }

    /**
     * Get one modules by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ModulesDTO> findOne(Long id) {
        LOG.debug("Request to get Modules : {}", id);
        return modulesRepository.findById(id).map(modulesMapper::toDto);
    }

    /**
     * Delete the modules by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Modules : {}", id);
        modulePermissionRepository.deleteByModuleId(id); // <-- borra dependencias primero
        modulesRepository.deleteById(id);
    }
}
