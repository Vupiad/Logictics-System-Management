package com.bkexpress.backend.repository;

import com.bkexpress.backend.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, String> {
    // Chỉ cần findAll() có sẵn là đủ
}
