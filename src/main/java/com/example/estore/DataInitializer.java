package com.example.estore;

import com.example.estore.entity.Product;
import com.example.estore.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initProducts(ProductRepository repository) {
        return args -> {

//            if (repository.count() > 0) {
//                return; // чтобы не дублировались
//            }

            repository.save(new Product(null, "Маяк проблесковый A1", "signal", 4500, "/images/mayak.png"));
            repository.save(new Product(null, "Маяк проблесковый B2", "signal", 5200, "/images/mayak2.png"));
            repository.save(new Product(null, "Маяк проблесковый C3", "signal", 6100, "/images/mayakc3.png"));
            repository.save(new Product(null, "Сигнальный маяк D4", "signal", 7000, "/images/mayakd4.png"));
            repository.save(new Product(null, "Маяк LED E5", "signal", 8200, "/images/led5.png"));
            repository.save(new Product(null, "Громкоговоритель 200 ГРП", "zvuk", 11500, "/images/grp.png"));
            repository.save(new Product(null, "Громкоговоритель 300 ГРП", "zvuk", 13000, "/images/grp300.png"));
            repository.save(new Product(null, "Сирена С-400", "zvuk", 9800, "/images/sirenac400.png"));
            repository.save(new Product(null, "Сирена С-500", "zvuk", 11000, "/images/sirenac500.png"));
            repository.save(new Product(null, "Звуковой модуль ZM-1", "zvuk", 7600, "/images/zm1.png"));
            repository.save(new Product(null, "Блок управления СГУ ЗЕВС 200П6", "control", 12000, "/images/sguzevs200.png"));
            repository.save(new Product(null, "Блок управления СГУ ЗЕВС 300", "control", 14500, "/images/sgu300.png"));
            repository.save(new Product(null, "Контроллер СГУ PRO", "control", 16500, "/images/sgupro.png"));
            repository.save(new Product(null, "Пульт управления СГУ", "control", 5400, "/images/pultSgu.png"));
            repository.save(new Product(null, "Модуль управления СГУ MINI", "control", 4900, "/images/sgumini.png"));
            repository.save(new Product(null, "Антенна A-100", "aksessuary", 1500, "/images/antenna100.png"));
            repository.save(new Product(null, "Антенна A-200", "aksessuary", 2300, "/images/Antenna200.png"));
            repository.save(new Product(null, "Кабель сигнальный", "aksessuary", 900, "/images/cable.png"));
            repository.save(new Product(null, "Разъём универсальный", "aksessuary", 600, "/images/raz_em.png"));
            repository.save(new Product(null, "Переходник СГУ", "aksessuary", 750, "/images/perehodsgu.png"));
            repository.save(new Product(null, "Крепежный набор", "montazh", 800, "/images/krepej.png"));
            repository.save(new Product(null, "Кронштейн усиленный", "montazh", 1400, "/images/kron.png"));
            repository.save(new Product(null, "Монтажная планка", "montazh", 950, "/images/planka.png"));
            repository.save(new Product(null, "Крепление магнитное", "montazh", 1800, "/images/magnit.png"));
            repository.save(new Product(null, "Комплект крепежа PRO", "montazh", 2200, "/images/prokrepej.png"));

        };
    }
}