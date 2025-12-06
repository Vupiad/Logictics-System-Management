package com.bkexpress.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "TaiXe")
@PrimaryKeyJoinColumn(name = "CCCD")
@Inheritance(strategy = InheritanceType.JOINED) // Tiếp tục nối xuống cấp dưới
@Data
@EqualsAndHashCode(callSuper = true)
public class TaiXe extends NhanVien {

    @Column(name = "bang_lai_xe")
    private String bangLaiXe;

    public String getBangLaiXe() {
        return bangLaiXe;
    }

    public void setBangLaiXe(String bangLaiXe) {
        this.bangLaiXe = bangLaiXe;
    }
}