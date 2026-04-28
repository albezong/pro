package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ModulePermissionDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ModulePermissionDTO.class);
        ModulePermissionDTO modulePermissionDTO1 = new ModulePermissionDTO();
        modulePermissionDTO1.setId(1L);
        ModulePermissionDTO modulePermissionDTO2 = new ModulePermissionDTO();
        assertThat(modulePermissionDTO1).isNotEqualTo(modulePermissionDTO2);
        modulePermissionDTO2.setId(modulePermissionDTO1.getId());
        assertThat(modulePermissionDTO1).isEqualTo(modulePermissionDTO2);
        modulePermissionDTO2.setId(2L);
        assertThat(modulePermissionDTO1).isNotEqualTo(modulePermissionDTO2);
        modulePermissionDTO1.setId(null);
        assertThat(modulePermissionDTO1).isNotEqualTo(modulePermissionDTO2);
    }
}
