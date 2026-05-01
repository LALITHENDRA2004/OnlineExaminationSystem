package com.exam.model;


import javax.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;


@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "roles")
public class Role {

    @Id
    private Long roleId;
    private String roleName;


    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY,mappedBy = "role")
    private Set<UserRole> userRoles=new HashSet<>();


    public Role(Long roleId, String roleName) {
        this.roleId = roleId;
        this.roleName = roleName;
    }
}
