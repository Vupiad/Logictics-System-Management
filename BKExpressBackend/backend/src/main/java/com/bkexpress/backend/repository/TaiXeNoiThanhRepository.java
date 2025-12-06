package com.bkexpress.backend.repository;

import com.bkexpress.backend.entity.TaiXeNoiThanh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaiXeNoiThanhRepository extends JpaRepository<TaiXeNoiThanh, String> {}
