package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ModulePermission.
 */
@Entity
@Table(name = "module_permission")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ModulePermission implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "can_create")
    private Boolean canCreate;

    @Column(name = "can_edit")
    private Boolean canEdit;

    @Column(name = "can_delete")
    private Boolean canDelete;

    @Column(name = "can_view")
    private Boolean canView;

    @Column(name = "can_history")
    private Boolean canHistory;

    /**
     * CAMBIO SOLICITADO:
     * ModulePermission tendrá la FK de Modules.
     * Se mostrará el 'nombre' del módulo en el cliente.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    private Modules module;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "permissions", "users" }, allowSetters = true)
    private Profile profile;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ModulePermission id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getCanCreate() {
        return this.canCreate;
    }

    public ModulePermission canCreate(Boolean canCreate) {
        this.setCanCreate(canCreate);
        return this;
    }

    public void setCanCreate(Boolean canCreate) {
        this.canCreate = canCreate;
    }

    public Boolean getCanEdit() {
        return this.canEdit;
    }

    public ModulePermission canEdit(Boolean canEdit) {
        this.setCanEdit(canEdit);
        return this;
    }

    public void setCanEdit(Boolean canEdit) {
        this.canEdit = canEdit;
    }

    public Boolean getCanDelete() {
        return this.canDelete;
    }

    public ModulePermission canDelete(Boolean canDelete) {
        this.setCanDelete(canDelete);
        return this;
    }

    public void setCanDelete(Boolean canDelete) {
        this.canDelete = canDelete;
    }

    public Boolean getCanView() {
        return this.canView;
    }

    public ModulePermission canView(Boolean canView) {
        this.setCanView(canView);
        return this;
    }

    public void setCanView(Boolean canView) {
        this.canView = canView;
    }

    public Boolean getCanHistory() {
        return this.canHistory;
    }

    public ModulePermission canHistory(Boolean canHistory) {
        this.setCanHistory(canHistory);
        return this;
    }

    public void setCanHistory(Boolean canHistory) {
        this.canHistory = canHistory;
    }

    public Modules getModule() {
        return this.module;
    }

    public void setModule(Modules modules) {
        this.module = modules;
    }

    public ModulePermission module(Modules modules) {
        this.setModule(modules);
        return this;
    }

    public Profile getProfile() {
        return this.profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public ModulePermission profile(Profile profile) {
        this.setProfile(profile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ModulePermission)) {
            return false;
        }
        return getId() != null && getId().equals(((ModulePermission) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ModulePermission{" +
            "id=" + getId() +
            ", canCreate='" + getCanCreate() + "'" +
            ", canEdit='" + getCanEdit() + "'" +
            ", canDelete='" + getCanDelete() + "'" +
            ", canView='" + getCanView() + "'" +
            ", canHistory='" + getCanHistory() + "'" +
            "}";
    }
}
