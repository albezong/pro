package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Profile;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.service.dto.ProfileDTO;
import com.mycompany.myapp.service.dto.UserDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Profile} and its DTO {@link ProfileDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProfileMapper extends EntityMapper<ProfileDTO, Profile> {
    @Mapping(target = "users", source = "users", qualifiedByName = "userLoginSet")
    ProfileDTO toDto(Profile s);

    @Mapping(target = "removeUser", ignore = true)
    Profile toEntity(ProfileDTO profileDTO);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);

    @Named("userLoginSet")
    default Set<UserDTO> toDtoUserLoginSet(Set<User> user) {
        return user.stream().map(this::toDtoUserLogin).collect(Collectors.toSet());
    }
}
