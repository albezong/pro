package com.mycompany.myapp.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.mycompany.myapp.domain.ModulePermission} entity. This class is used
 * in {@link com.mycompany.myapp.web.rest.ModulePermissionResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /module-permissions?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ModulePermissionCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private BooleanFilter canCreate;

    private BooleanFilter canEdit;

    private BooleanFilter canDelete;

    private BooleanFilter canView;

    private BooleanFilter canHistory;

    private LongFilter moduleId;

    private LongFilter profileId;

    private Boolean distinct;

    public ModulePermissionCriteria() {}

    public ModulePermissionCriteria(ModulePermissionCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.canCreate = other.optionalCanCreate().map(BooleanFilter::copy).orElse(null);
        this.canEdit = other.optionalCanEdit().map(BooleanFilter::copy).orElse(null);
        this.canDelete = other.optionalCanDelete().map(BooleanFilter::copy).orElse(null);
        this.canView = other.optionalCanView().map(BooleanFilter::copy).orElse(null);
        this.canHistory = other.optionalCanHistory().map(BooleanFilter::copy).orElse(null);
        this.moduleId = other.optionalModuleId().map(LongFilter::copy).orElse(null);
        this.profileId = other.optionalProfileId().map(LongFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public ModulePermissionCriteria copy() {
        return new ModulePermissionCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public Optional<LongFilter> optionalId() {
        return Optional.ofNullable(id);
    }

    public LongFilter id() {
        if (id == null) {
            setId(new LongFilter());
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public BooleanFilter getCanCreate() {
        return canCreate;
    }

    public Optional<BooleanFilter> optionalCanCreate() {
        return Optional.ofNullable(canCreate);
    }

    public BooleanFilter canCreate() {
        if (canCreate == null) {
            setCanCreate(new BooleanFilter());
        }
        return canCreate;
    }

    public void setCanCreate(BooleanFilter canCreate) {
        this.canCreate = canCreate;
    }

    public BooleanFilter getCanEdit() {
        return canEdit;
    }

    public Optional<BooleanFilter> optionalCanEdit() {
        return Optional.ofNullable(canEdit);
    }

    public BooleanFilter canEdit() {
        if (canEdit == null) {
            setCanEdit(new BooleanFilter());
        }
        return canEdit;
    }

    public void setCanEdit(BooleanFilter canEdit) {
        this.canEdit = canEdit;
    }

    public BooleanFilter getCanDelete() {
        return canDelete;
    }

    public Optional<BooleanFilter> optionalCanDelete() {
        return Optional.ofNullable(canDelete);
    }

    public BooleanFilter canDelete() {
        if (canDelete == null) {
            setCanDelete(new BooleanFilter());
        }
        return canDelete;
    }

    public void setCanDelete(BooleanFilter canDelete) {
        this.canDelete = canDelete;
    }

    public BooleanFilter getCanView() {
        return canView;
    }

    public Optional<BooleanFilter> optionalCanView() {
        return Optional.ofNullable(canView);
    }

    public BooleanFilter canView() {
        if (canView == null) {
            setCanView(new BooleanFilter());
        }
        return canView;
    }

    public void setCanView(BooleanFilter canView) {
        this.canView = canView;
    }

    public BooleanFilter getCanHistory() {
        return canHistory;
    }

    public Optional<BooleanFilter> optionalCanHistory() {
        return Optional.ofNullable(canHistory);
    }

    public BooleanFilter canHistory() {
        if (canHistory == null) {
            setCanHistory(new BooleanFilter());
        }
        return canHistory;
    }

    public void setCanHistory(BooleanFilter canHistory) {
        this.canHistory = canHistory;
    }

    public LongFilter getModuleId() {
        return moduleId;
    }

    public Optional<LongFilter> optionalModuleId() {
        return Optional.ofNullable(moduleId);
    }

    public LongFilter moduleId() {
        if (moduleId == null) {
            setModuleId(new LongFilter());
        }
        return moduleId;
    }

    public void setModuleId(LongFilter moduleId) {
        this.moduleId = moduleId;
    }

    public LongFilter getProfileId() {
        return profileId;
    }

    public Optional<LongFilter> optionalProfileId() {
        return Optional.ofNullable(profileId);
    }

    public LongFilter profileId() {
        if (profileId == null) {
            setProfileId(new LongFilter());
        }
        return profileId;
    }

    public void setProfileId(LongFilter profileId) {
        this.profileId = profileId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public Optional<Boolean> optionalDistinct() {
        return Optional.ofNullable(distinct);
    }

    public Boolean distinct() {
        if (distinct == null) {
            setDistinct(true);
        }
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final ModulePermissionCriteria that = (ModulePermissionCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(canCreate, that.canCreate) &&
            Objects.equals(canEdit, that.canEdit) &&
            Objects.equals(canDelete, that.canDelete) &&
            Objects.equals(canView, that.canView) &&
            Objects.equals(canHistory, that.canHistory) &&
            Objects.equals(moduleId, that.moduleId) &&
            Objects.equals(profileId, that.profileId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, canCreate, canEdit, canDelete, canView, canHistory, moduleId, profileId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ModulePermissionCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalCanCreate().map(f -> "canCreate=" + f + ", ").orElse("") +
            optionalCanEdit().map(f -> "canEdit=" + f + ", ").orElse("") +
            optionalCanDelete().map(f -> "canDelete=" + f + ", ").orElse("") +
            optionalCanView().map(f -> "canView=" + f + ", ").orElse("") +
            optionalCanHistory().map(f -> "canHistory=" + f + ", ").orElse("") +
            optionalModuleId().map(f -> "moduleId=" + f + ", ").orElse("") +
            optionalProfileId().map(f -> "profileId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
