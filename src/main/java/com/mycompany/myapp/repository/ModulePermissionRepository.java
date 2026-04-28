package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ModulePermission;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ModulePermission entity.
 */
@Repository
public interface ModulePermissionRepository
        extends JpaRepository<ModulePermission, Long>, JpaSpecificationExecutor<ModulePermission> {
    default Optional<ModulePermission> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ModulePermission> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ModulePermission> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select modulePermission from ModulePermission modulePermission left join fetch modulePermission.module left join fetch modulePermission.profile", countQuery = "select count(modulePermission) from ModulePermission modulePermission")
    Page<ModulePermission> findAllWithToOneRelationships(Pageable pageable);

    @Query("select modulePermission from ModulePermission modulePermission left join fetch modulePermission.module left join fetch modulePermission.profile")
    List<ModulePermission> findAllWithToOneRelationships();

    @Query("select modulePermission from ModulePermission modulePermission left join fetch modulePermission.module left join fetch modulePermission.profile where modulePermission.id =:id")
    Optional<ModulePermission> findOneWithToOneRelationships(@Param("id") Long id);

    @Query("select mp from ModulePermission mp join fetch mp.module m " +
            "where mp.profile.id = :profileId and lower(m.nombre) = lower(:moduleName)")
    Optional<ModulePermission> findByProfileIdAndModuleName(@Param("profileId") Long profileId,
            @Param("moduleName") String moduleName);

    @Query("select mp from ModulePermission mp join fetch mp.module " + "where mp.profile.id in :profileIds")
    List<ModulePermission> findByProfileIdIn(@Param("profileIds") List<Long> profileIds);

    void deleteByModuleId(Long moduleId);
}
