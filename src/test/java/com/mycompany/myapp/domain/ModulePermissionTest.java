package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ModulePermissionTestSamples.*;
import static com.mycompany.myapp.domain.ModulesTestSamples.*;
import static com.mycompany.myapp.domain.ProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ModulePermissionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ModulePermission.class);
        ModulePermission modulePermission1 = getModulePermissionSample1();
        ModulePermission modulePermission2 = new ModulePermission();
        assertThat(modulePermission1).isNotEqualTo(modulePermission2);

        modulePermission2.setId(modulePermission1.getId());
        assertThat(modulePermission1).isEqualTo(modulePermission2);

        modulePermission2 = getModulePermissionSample2();
        assertThat(modulePermission1).isNotEqualTo(modulePermission2);
    }

    @Test
    void moduleTest() {
        ModulePermission modulePermission = getModulePermissionRandomSampleGenerator();
        Modules modulesBack = getModulesRandomSampleGenerator();

        modulePermission.setModule(modulesBack);
        assertThat(modulePermission.getModule()).isEqualTo(modulesBack);

        modulePermission.module(null);
        assertThat(modulePermission.getModule()).isNull();
    }

    @Test
    void profileTest() {
        ModulePermission modulePermission = getModulePermissionRandomSampleGenerator();
        Profile profileBack = getProfileRandomSampleGenerator();

        modulePermission.setProfile(profileBack);
        assertThat(modulePermission.getProfile()).isEqualTo(profileBack);

        modulePermission.profile(null);
        assertThat(modulePermission.getProfile()).isNull();
    }
}
