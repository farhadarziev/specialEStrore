package com.example.estore.model;

public class Product {
    private Long id;
    private String name;
    private String category;
    private int price;
    private String image; // путь в /images/


    public Product(Long id, String name, String category, int price, String image) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.image = image;
    }
    // геттеры и сеттеры
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public int getPrice() { return price; }
    public String getImage() { return image; }
}
