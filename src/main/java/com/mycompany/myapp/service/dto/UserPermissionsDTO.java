package com.mycompany.myapp.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * DTO returned by /api/account/permissions
 * Contains the full permission map for the authenticated user.
 *
 * NOTE: @JsonProperty annotations required to ensure Jackson serializes
 * boolean fields named with "is" prefix as "isAdmin"/"isSuperAdmin" and not "admin"/"superAdmin".
 */
public class UserPermissionsDTO implements Serializable {

    @JsonProperty("isAdmin")
    private boolean isAdmin;

    @JsonProperty("isSuperAdmin")
    private boolean isSuperAdmin;

    /** moduleName -> access flags. Null/absent means no access at all. */
    private Map<String, ModuleAccess> modules = new LinkedHashMap<>();

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public boolean isSuperAdmin() {
        return isSuperAdmin;
    }

    public void setSuperAdmin(boolean superAdmin) {
        isSuperAdmin = superAdmin;
    }

    public Map<String, ModuleAccess> getModules() {
        return modules;
    }

    public void setModules(Map<String, ModuleAccess> modules) {
        this.modules = modules;
    }

    public static class ModuleAccess implements Serializable {

        private boolean canView;
        private boolean canCreate;
        private boolean canEdit;
        private boolean canDelete;
        private boolean canHistory;

        /** Merge two accesses with OR logic (union of permissions across profiles) */
        public static ModuleAccess merge(ModuleAccess a, ModuleAccess b) {
            ModuleAccess m = new ModuleAccess();
            m.canView = a.canView || b.canView;
            m.canCreate = a.canCreate || b.canCreate;
            m.canEdit = a.canEdit || b.canEdit;
            m.canDelete = a.canDelete || b.canDelete;
            m.canHistory = a.canHistory || b.canHistory;
            return m;
        }

        public boolean isCanView() {
            return canView;
        }

        public void setCanView(boolean v) {
            canView = v;
        }

        public boolean isCanCreate() {
            return canCreate;
        }

        public void setCanCreate(boolean v) {
            canCreate = v;
        }

        public boolean isCanEdit() {
            return canEdit;
        }

        public void setCanEdit(boolean v) {
            canEdit = v;
        }

        public boolean isCanDelete() {
            return canDelete;
        }

        public void setCanDelete(boolean v) {
            canDelete = v;
        }

        public boolean isCanHistory() {
            return canHistory;
        }

        public void setCanHistory(boolean v) {
            canHistory = v;
        }
    }
}
