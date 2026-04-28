package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Profile;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Profile entity.
 *
 * When extending this class, extend ProfileRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface ProfileRepository
    extends ProfileRepositoryWithBagRelationships, JpaRepository<Profile, Long>, JpaSpecificationExecutor<Profile> {
    default Optional<Profile> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Profile> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Profile> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    @Query("select distinct p from Profile p join p.users u " + "where u.login = :login and (p.active is null or p.active = true)")
    List<Profile> findActiveProfilesByUserLogin(@Param("login") String login);
}
