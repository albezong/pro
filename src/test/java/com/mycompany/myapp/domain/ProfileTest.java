package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ModulePermissionTestSamples.*;
import static com.mycompany.myapp.domain.ProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ProfileTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Profile.class);
        Profile profile1 = getProfileSample1();
        Profile profile2 = new Profile();
        assertThat(profile1).isNotEqualTo(profile2);

        profile2.setId(profile1.getId());
        assertThat(profile1).isEqualTo(profile2);

        profile2 = getProfileSample2();
        assertThat(profile1).isNotEqualTo(profile2);
    }

    @Test
    void permissionsTest() {
        Profile profile = getProfileRandomSampleGenerator();
        ModulePermission modulePermissionBack = getModulePermissionRandomSampleGenerator();

        profile.addPermissions(modulePermissionBack);
        assertThat(profile.getPermissions()).containsOnly(modulePermissionBack);
        assertThat(modulePermissionBack.getProfile()).isEqualTo(profile);

        profile.removePermissions(modulePermissionBack);
        assertThat(profile.getPermissions()).doesNotContain(modulePermissionBack);
        assertThat(modulePermissionBack.getProfile()).isNull();

        profile.permissions(new HashSet<>(Set.of(modulePermissionBack)));
        assertThat(profile.getPermissions()).containsOnly(modulePermissionBack);
        assertThat(modulePermissionBack.getProfile()).isEqualTo(profile);

        profile.setPermissions(new HashSet<>());
        assertThat(profile.getPermissions()).doesNotContain(modulePermissionBack);
        assertThat(modulePermissionBack.getProfile()).isNull();
    }
}
