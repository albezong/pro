package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class ModulePermissionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ModulePermission getModulePermissionSample1() {
        return new ModulePermission().id(1L);
    }

    public static ModulePermission getModulePermissionSample2() {
        return new ModulePermission().id(2L);
    }

    public static ModulePermission getModulePermissionRandomSampleGenerator() {
        return new ModulePermission().id(longCount.incrementAndGet());
    }
}
