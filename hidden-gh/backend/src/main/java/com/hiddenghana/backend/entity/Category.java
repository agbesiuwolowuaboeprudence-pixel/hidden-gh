package com.hiddenghana.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @Column(length = 30)
    private String id;

    @Column(nullable = false, length = 60)
    private String label;

    @Column(nullable = false, length = 60)
    private String icon;

    @Column(length = 10)
    private String color;
}
