package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ModulesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ModulesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Modules.class);
        Modules modules1 = getModulesSample1();
        Modules modules2 = new Modules();
        assertThat(modules1).isNotEqualTo(modules2);

        modules2.setId(modules1.getId());
        assertThat(modules1).isEqualTo(modules2);

        modules2 = getModulesSample2();
        assertThat(modules1).isNotEqualTo(modules2);
    }
}
