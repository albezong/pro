package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.config.Constants;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.repository.UserRepository;
import com.mycompany.myapp.service.MailService;
import com.mycompany.myapp.service.PermissionService;
import com.mycompany.myapp.service.UserService;
import com.mycompany.myapp.service.dto.AdminUserDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import com.mycompany.myapp.web.rest.errors.EmailAlreadyUsedException;
import com.mycompany.myapp.web.rest.errors.LoginAlreadyUsedException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing users.
 * Access is controlled by the custom PermissionService (module: "Usuarios").
 * ROLE_ADMIN de JHipster NO da acceso automático — cualquier usuario
 * con un perfil que tenga permiso en el módulo "Usuarios" puede operar aquí,
 * incluyendo usuarios con isSuperAdmin=true en su perfil.
 */
@RestController
@RequestMapping("/api/admin")
public class UserResource {

    private static final List<String> ALLOWED_ORDERED_PROPERTIES = Collections.unmodifiableList(
        Arrays.asList(
            "id",
            "login",
            "firstName",
            "lastName",
            "email",
            "activated",
            "langKey",
            "createdBy",
            "createdDate",
            "lastModifiedBy",
            "lastModifiedDate"
        )
    );

    private static final Logger LOG = LoggerFactory.getLogger(UserResource.class);
    private static final String MODULE = "Usuarios";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserService userService;
    private final UserRepository userRepository;
    private final MailService mailService;
    private final PermissionService permissionService;

    public UserResource(
        UserService userService,
        UserRepository userRepository,
        MailService mailService,
        PermissionService permissionService
    ) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.permissionService = permissionService;
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@Valid @RequestBody AdminUserDTO userDTO) throws URISyntaxException {
        LOG.debug("REST request to save User : {}", userDTO);
        if (!permissionService.hasPermission(MODULE, "create")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (userDTO.getId() != null) {
            throw new BadRequestAlertException("A new user cannot already have an ID", "userManagement", "idexists");
        } else if (userRepository.findOneByLogin(userDTO.getLogin().toLowerCase()).isPresent()) {
            throw new LoginAlreadyUsedException();
        } else if (userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).isPresent()) {
            throw new EmailAlreadyUsedException();
        } else {
            User newUser = userService.createUser(userDTO);
            mailService.sendCreationEmail(newUser);
            return ResponseEntity.created(new URI("/api/admin/users/" + newUser.getLogin()))
                .headers(HeaderUtil.createAlert(applicationName, "userManagement.created", newUser.getLogin()))
                .body(newUser);
        }
    }

    @PutMapping({ "/users", "/users/{login}" })
    public ResponseEntity<AdminUserDTO> updateUser(
        @PathVariable(name = "login", required = false) @Pattern(regexp = Constants.LOGIN_REGEX) String login,
        @Valid @RequestBody AdminUserDTO userDTO
    ) {
        LOG.debug("REST request to update User : {}", userDTO);
        if (!permissionService.hasPermission(MODULE, "edit")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail());
        if (existingUser.isPresent() && (!existingUser.orElseThrow().getId().equals(userDTO.getId()))) {
            throw new EmailAlreadyUsedException();
        }
        existingUser = userRepository.findOneByLogin(userDTO.getLogin().toLowerCase());
        if (existingUser.isPresent() && (!existingUser.orElseThrow().getId().equals(userDTO.getId()))) {
            throw new LoginAlreadyUsedException();
        }
        Optional<AdminUserDTO> updatedUser = userService.updateUser(userDTO);
        return ResponseUtil.wrapOrNotFound(
            updatedUser,
            HeaderUtil.createAlert(applicationName, "userManagement.updated", userDTO.getLogin())
        );
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDTO>> getAllUsers(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(value = "login.contains", required = false) String login,
        @RequestParam(value = "activated.equals", required = false) Boolean activated,
        @RequestParam(value = "profileId.equals", required = false) Long profileId
    ) {
        LOG.debug("REST request to get all Users with filters: login={}, activated={}, profileId={}", login, activated, profileId);
        if (!permissionService.hasPermission(MODULE, "view")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (!onlyContainsAllowedProperties(pageable)) {
            return ResponseEntity.badRequest().build();
        }
        final Page<AdminUserDTO> page = userService.getAllManagedUsersWithFilters(pageable, login, activated, profileId);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    private boolean onlyContainsAllowedProperties(Pageable pageable) {
        return pageable.getSort().stream().map(Sort.Order::getProperty).allMatch(ALLOWED_ORDERED_PROPERTIES::contains);
    }

    @GetMapping("/users/{login}")
    public ResponseEntity<AdminUserDTO> getUser(@PathVariable("login") @Pattern(regexp = Constants.LOGIN_REGEX) String login) {
        LOG.debug("REST request to get User : {}", login);
        if (!permissionService.hasPermission(MODULE, "view")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseUtil.wrapOrNotFound(userService.getUserWithAuthoritiesByLogin(login).map(AdminUserDTO::new));
    }

    @DeleteMapping("/users/{login}")
    public ResponseEntity<Void> deleteUser(@PathVariable("login") @Pattern(regexp = Constants.LOGIN_REGEX) String login) {
        LOG.debug("REST request to delete User: {}", login);
        if (!permissionService.hasPermission(MODULE, "delete")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        userService.deleteUser(login);
        return ResponseEntity.noContent().headers(HeaderUtil.createAlert(applicationName, "userManagement.deleted", login)).build();
    }
}
