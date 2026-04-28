package com.mycompany.myapp.service.mapper;

import static com.mycompany.myapp.domain.ModulesAsserts.*;
import static com.mycompany.myapp.domain.ModulesTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ModulesMapperTest {

    private ModulesMapper modulesMapper;

    @BeforeEach
    void setUp() {
        modulesMapper = new ModulesMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getModulesSample1();
        var actual = modulesMapper.toEntity(modulesMapper.toDto(expected));
        assertModulesAllPropertiesEquals(expected, actual);
    }
}
