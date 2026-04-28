package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.ModulePermission;
import com.mycompany.myapp.repository.ModulePermissionRepository;
import com.mycompany.myapp.service.dto.ModulePermissionDTO;
import com.mycompany.myapp.service.mapper.ModulePermissionMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.ModulePermission}.
 */
@Service
@Transactional
public class ModulePermissionService {

    private static final Logger LOG = LoggerFactory.getLogger(ModulePermissionService.class);

    private final ModulePermissionRepository modulePermissionRepository;

    private final ModulePermissionMapper modulePermissionMapper;

    public ModulePermissionService(ModulePermissionRepository modulePermissionRepository, ModulePermissionMapper modulePermissionMapper) {
        this.modulePermissionRepository = modulePermissionRepository;
        this.modulePermissionMapper = modulePermissionMapper;
    }

    /**
     * Save a modulePermission.
     *
     * @param modulePermissionDTO the entity to save.
     * @return the persisted entity.
     */
    public ModulePermissionDTO save(ModulePermissionDTO modulePermissionDTO) {
        LOG.debug("Request to save ModulePermission : {}", modulePermissionDTO);
        ModulePermission modulePermission = modulePermissionMapper.toEntity(modulePermissionDTO);
        modulePermission = modulePermissionRepository.save(modulePermission);
        return modulePermissionMapper.toDto(modulePermission);
    }

    /**
     * Update a modulePermission.
     *
     * @param modulePermissionDTO the entity to save.
     * @return the persisted entity.
     */
    public ModulePermissionDTO update(ModulePermissionDTO modulePermissionDTO) {
        LOG.debug("Request to update ModulePermission : {}", modulePermissionDTO);
        ModulePermission modulePermission = modulePermissionMapper.toEntity(modulePermissionDTO);
        modulePermission = modulePermissionRepository.save(modulePermission);
        return modulePermissionMapper.toDto(modulePermission);
    }

    /**
     * Partially update a modulePermission.
     *
     * @param modulePermissionDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ModulePermissionDTO> partialUpdate(ModulePermissionDTO modulePermissionDTO) {
        LOG.debug("Request to partially update ModulePermission : {}", modulePermissionDTO);

        return modulePermissionRepository
            .findById(modulePermissionDTO.getId())
            .map(existingModulePermission -> {
                modulePermissionMapper.partialUpdate(existingModulePermission, modulePermissionDTO);

                return existingModulePermission;
            })
            .map(modulePermissionRepository::save)
            .map(modulePermissionMapper::toDto);
    }

    /**
     * Get all the modulePermissions with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<ModulePermissionDTO> findAllWithEagerRelationships(Pageable pageable) {
        return modulePermissionRepository.findAllWithEagerRelationships(pageable).map(modulePermissionMapper::toDto);
    }

    /**
     * Get one modulePermission by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ModulePermissionDTO> findOne(Long id) {
        LOG.debug("Request to get ModulePermission : {}", id);
        return modulePermissionRepository.findOneWithEagerRelationships(id).map(modulePermissionMapper::toDto);
    }

    /**
     * Delete the modulePermission by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ModulePermission : {}", id);
        modulePermissionRepository.deleteById(id);
    }
}
