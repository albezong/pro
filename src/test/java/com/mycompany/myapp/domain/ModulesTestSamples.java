package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ModulesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Modules getModulesSample1() {
        return new Modules().id(1L).nombre("nombre1");
    }

    public static Modules getModulesSample2() {
        return new Modules().id(2L).nombre("nombre2");
    }

    public static Modules getModulesRandomSampleGenerator() {
        return new Modules().id(longCount.incrementAndGet()).nombre(UUID.randomUUID().toString());
    }
}
