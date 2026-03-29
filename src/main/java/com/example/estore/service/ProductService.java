package com.example.estore.service;



import com.example.estore.model.Product;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import java.util.stream.Collectors;

@Service
public class ProductService {
    private final List<Product> products = new ArrayList<>();

    public ProductService() {
        products.add(new Product(1L, "Маяк проблесковый A1", "signal", 4500, "/images/mayak.png"));
        products.add(new Product(2L, "Маяк проблесковый B2", "signal", 5200, "/images/mayak2.png"));
        products.add(new Product(3L, "Маяк проблесковый C3", "signal", 6100, "/images/mayakc3.png"));
        products.add(new Product(4L, "Сигнальный маяк D4", "signal", 7000, "/images/mayakd4.png"));
        products.add(new Product(5L, "Маяк LED E5", "signal", 8200, "/images/led5.png"));

        products.add(new Product(6L, "Громкоговоритель 200 ГРП", "zvuk", 11500, "/images/grp.png"));
        products.add(new Product(7L, "Громкоговоритель 300 ГРП", "zvuk", 13000, "/images/grp300.png"));
        products.add(new Product(8L, "Сирена С-400", "zvuk", 9800, "/images/sirenac400.png"));
        products.add(new Product(9L, "Сирена С-500", "zvuk", 11000, "/images/sirenac500.png"));
        products.add(new Product(10L, "Звуковой модуль ZM-1", "zvuk", 7600, "/images/zm1.png"));

        products.add(new Product(11L, "Блок управления СГУ ЗЕВС 200П6", "control", 12000, "/images/sguzevs200.png"));
        products.add(new Product(12L, "Блок управления СГУ ЗЕВС 300", "control", 14500, "/images/sgu300.png"));
        products.add(new Product(13L, "Контроллер СГУ PRO", "control", 16500, "/images/sgupro.png"));
        products.add(new Product(14L, "Пульт управления СГУ", "control", 5400, "/images/pultSgu.png"));
        products.add(new Product(15L, "Модуль управления СГУ MINI", "control", 4900, "/images/sgumini.png"));

        products.add(new Product(16L, "Антенна A-100", "aksessuary", 1500, "/images/antenna100.png"));
        products.add(new Product(17L, "Антенна A-200", "aksessuary", 2300, "/images/Antenna200.png"));
        products.add(new Product(18L, "Кабель сигнальный", "aksessuary", 900, "/images/cable.png"));
        products.add(new Product(19L, "Разъём универсальный", "aksessuary", 600, "/images/raz_em.png"));
        products.add(new Product(20L, "Переходник СГУ", "aksessuary", 750, "/images/perehodsgu.png"));

        products.add(new Product(21L, "Крепежный набор", "montazh", 800, "/images/krepej.png"));
        products.add(new Product(22L, "Кронштейн усиленный", "montazh", 1400, "/images/kron.png"));
        products.add(new Product(23L, "Монтажная планка", "montazh", 950, "/images/planka.png"));
        products.add(new Product(24L, "Крепление магнитное", "montazh", 1800, "/images/magnit.png"));
        products.add(new Product(25L, "Комплект крепежа PRO", "montazh", 2200, "/images/prokrepej.png"));

        // ... можно добавить ещё
    }

    public List<Product> findAll() {
        return new ArrayList<>(products);
    }

    public List<Product> findByCategory(String category) {
        return products.stream()
                .filter(p -> p.getCategory().equalsIgnoreCase(category))
                .toList();
    }

    public Product findById(Long id) {
        return products.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst()
                .orElse(null);
    }



    public List<Product> search(String query) {
        if (query == null || query.trim().isEmpty()) return Collections.emptyList();
        String q = query.toLowerCase();
        return products.stream()
                .filter(p -> p.getName().toLowerCase().contains(q) || p.getCategory().toLowerCase().contains(q))
                .collect(Collectors.toList());
    }


}
