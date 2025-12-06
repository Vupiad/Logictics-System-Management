package com.bkexpress.backend.repository;

import com.bkexpress.backend.entity.TaiXeLienTinh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaiXeLienTinhRepository extends JpaRepository<TaiXeLienTinh, String> {}
