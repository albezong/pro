package com.mycompany.myapp.service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.ModulePermission} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ModulePermissionDTO implements Serializable {

    private Long id;

    private Boolean canCreate;

    private Boolean canEdit;

    private Boolean canDelete;

    private Boolean canView;

    private Boolean canHistory;

    @Schema(
        description = "CAMBIO SOLICITADO:\nModulePermission tendrá la FK de Modules.\nSe mostrará el 'nombre' del módulo en el cliente."
    )
    private ModulesDTO module;

    private ProfileDTO profile;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getCanCreate() {
        return canCreate;
    }

    public void setCanCreate(Boolean canCreate) {
        this.canCreate = canCreate;
    }

    public Boolean getCanEdit() {
        return canEdit;
    }

    public void setCanEdit(Boolean canEdit) {
        this.canEdit = canEdit;
    }

    public Boolean getCanDelete() {
        return canDelete;
    }

    public void setCanDelete(Boolean canDelete) {
        this.canDelete = canDelete;
    }

    public Boolean getCanView() {
        return canView;
    }

    public void setCanView(Boolean canView) {
        this.canView = canView;
    }

    public Boolean getCanHistory() {
        return canHistory;
    }

    public void setCanHistory(Boolean canHistory) {
        this.canHistory = canHistory;
    }

    public ModulesDTO getModule() {
        return module;
    }

    public void setModule(ModulesDTO module) {
        this.module = module;
    }

    public ProfileDTO getProfile() {
        return profile;
    }

    public void setProfile(ProfileDTO profile) {
        this.profile = profile;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ModulePermissionDTO)) {
            return false;
        }

        ModulePermissionDTO modulePermissionDTO = (ModulePermissionDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, modulePermissionDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ModulePermissionDTO{" +
            "id=" + getId() +
            ", canCreate='" + getCanCreate() + "'" +
            ", canEdit='" + getCanEdit() + "'" +
            ", canDelete='" + getCanDelete() + "'" +
            ", canView='" + getCanView() + "'" +
            ", canHistory='" + getCanHistory() + "'" +
            ", module=" + getModule() +
            ", profile=" + getProfile() +
            "}";
    }
}
