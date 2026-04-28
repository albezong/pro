package com.mycompany.myapp.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Objects;
import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class ModulePermissionCriteriaTest {

    @Test
    void newModulePermissionCriteriaHasAllFiltersNullTest() {
        var modulePermissionCriteria = new ModulePermissionCriteria();
        assertThat(modulePermissionCriteria).is(criteriaFiltersAre(Objects::isNull));
    }

    @Test
    void modulePermissionCriteriaFluentMethodsCreatesFiltersTest() {
        var modulePermissionCriteria = new ModulePermissionCriteria();

        setAllFilters(modulePermissionCriteria);

        assertThat(modulePermissionCriteria).is(criteriaFiltersAre(Objects::nonNull));
    }

    @Test
    void modulePermissionCriteriaCopyCreatesNullFilterTest() {
        var modulePermissionCriteria = new ModulePermissionCriteria();
        var copy = modulePermissionCriteria.copy();

        assertThat(modulePermissionCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::isNull)),
            criteria -> assertThat(criteria).isEqualTo(modulePermissionCriteria)
        );
    }

    @Test
    void modulePermissionCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var modulePermissionCriteria = new ModulePermissionCriteria();
        setAllFilters(modulePermissionCriteria);

        var copy = modulePermissionCriteria.copy();

        assertThat(modulePermissionCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::nonNull)),
            criteria -> assertThat(criteria).isEqualTo(modulePermissionCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var modulePermissionCriteria = new ModulePermissionCriteria();

        assertThat(modulePermissionCriteria).hasToString("ModulePermissionCriteria{}");
    }

    private static void setAllFilters(ModulePermissionCriteria modulePermissionCriteria) {
        modulePermissionCriteria.id();
        modulePermissionCriteria.canCreate();
        modulePermissionCriteria.canEdit();
        modulePermissionCriteria.canDelete();
        modulePermissionCriteria.canView();
        modulePermissionCriteria.canHistory();
        modulePermissionCriteria.moduleId();
        modulePermissionCriteria.profileId();
        modulePermissionCriteria.distinct();
    }

    private static Condition<ModulePermissionCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getCanCreate()) &&
                condition.apply(criteria.getCanEdit()) &&
                condition.apply(criteria.getCanDelete()) &&
                condition.apply(criteria.getCanView()) &&
                condition.apply(criteria.getCanHistory()) &&
                condition.apply(criteria.getModuleId()) &&
                condition.apply(criteria.getProfileId()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<ModulePermissionCriteria> copyFiltersAre(
        ModulePermissionCriteria copy,
        BiFunction<Object, Object, Boolean> condition
    ) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getCanCreate(), copy.getCanCreate()) &&
                condition.apply(criteria.getCanEdit(), copy.getCanEdit()) &&
                condition.apply(criteria.getCanDelete(), copy.getCanDelete()) &&
                condition.apply(criteria.getCanView(), copy.getCanView()) &&
                condition.apply(criteria.getCanHistory(), copy.getCanHistory()) &&
                condition.apply(criteria.getModuleId(), copy.getModuleId()) &&
                condition.apply(criteria.getProfileId(), copy.getProfileId()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
