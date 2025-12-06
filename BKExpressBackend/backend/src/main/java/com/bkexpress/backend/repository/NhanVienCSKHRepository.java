package com.bkexpress.backend.repository;

import com.bkexpress.backend.entity.NhanVienCSKH;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NhanVienCSKHRepository extends JpaRepository<NhanVienCSKH, String> {}