package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.ModulePermission;
import com.mycompany.myapp.domain.Modules;
import com.mycompany.myapp.domain.Profile;
import com.mycompany.myapp.service.dto.ModulePermissionDTO;
import com.mycompany.myapp.service.dto.ModulesDTO;
import com.mycompany.myapp.service.dto.ProfileDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ModulePermission} and its DTO {@link ModulePermissionDTO}.
 */
@Mapper(componentModel = "spring")
public interface ModulePermissionMapper extends EntityMapper<ModulePermissionDTO, ModulePermission> {
    @Mapping(target = "module", source = "module", qualifiedByName = "modulesNombre")
    @Mapping(target = "profile", source = "profile", qualifiedByName = "profileName")
    ModulePermissionDTO toDto(ModulePermission s);

    @Named("modulesNombre")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nombre", source = "nombre")
    ModulesDTO toDtoModulesNombre(Modules modules);

    @Named("profileName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    ProfileDTO toDtoProfileName(Profile profile);
}
