package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Modules;
import com.mycompany.myapp.service.dto.ModulesDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Modules} and its DTO {@link ModulesDTO}.
 */
@Mapper(componentModel = "spring")
public interface ModulesMapper extends EntityMapper<ModulesDTO, Modules> {}
