package com.mycompany.myapp.service.mapper;

import static com.mycompany.myapp.domain.ModulePermissionAsserts.*;
import static com.mycompany.myapp.domain.ModulePermissionTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ModulePermissionMapperTest {

    private ModulePermissionMapper modulePermissionMapper;

    @BeforeEach
    void setUp() {
        modulePermissionMapper = new ModulePermissionMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getModulePermissionSample1();
        var actual = modulePermissionMapper.toEntity(modulePermissionMapper.toDto(expected));
        assertModulePermissionAllPropertiesEquals(expected, actual);
    }
}
