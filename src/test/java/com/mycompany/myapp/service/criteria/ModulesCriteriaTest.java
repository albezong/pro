package com.mycompany.myapp.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Objects;
import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class ModulesCriteriaTest {

    @Test
    void newModulesCriteriaHasAllFiltersNullTest() {
        var modulesCriteria = new ModulesCriteria();
        assertThat(modulesCriteria).is(criteriaFiltersAre(Objects::isNull));
    }

    @Test
    void modulesCriteriaFluentMethodsCreatesFiltersTest() {
        var modulesCriteria = new ModulesCriteria();

        setAllFilters(modulesCriteria);

        assertThat(modulesCriteria).is(criteriaFiltersAre(Objects::nonNull));
    }

    @Test
    void modulesCriteriaCopyCreatesNullFilterTest() {
        var modulesCriteria = new ModulesCriteria();
        var copy = modulesCriteria.copy();

        assertThat(modulesCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::isNull)),
            criteria -> assertThat(criteria).isEqualTo(modulesCriteria)
        );
    }

    @Test
    void modulesCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var modulesCriteria = new ModulesCriteria();
        setAllFilters(modulesCriteria);

        var copy = modulesCriteria.copy();

        assertThat(modulesCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::nonNull)),
            criteria -> assertThat(criteria).isEqualTo(modulesCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var modulesCriteria = new ModulesCriteria();

        assertThat(modulesCriteria).hasToString("ModulesCriteria{}");
    }

    private static void setAllFilters(ModulesCriteria modulesCriteria) {
        modulesCriteria.id();
        modulesCriteria.nombre();
        modulesCriteria.fechaCreacion();
        modulesCriteria.distinct();
    }

    private static Condition<ModulesCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getNombre()) &&
                condition.apply(criteria.getFechaCreacion()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<ModulesCriteria> copyFiltersAre(ModulesCriteria copy, BiFunction<Object, Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getNombre(), copy.getNombre()) &&
                condition.apply(criteria.getFechaCreacion(), copy.getFechaCreacion()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
