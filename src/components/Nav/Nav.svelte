<script lang="ts">
    import { link } from "svelte-spa-router";
    import { navItems, currentPath } from "./Nav";
    import styles from "./Nav.module.css";
</script>

<nav class={styles.nav}>
    <div class={styles.navContainer}>
        <div class={styles.navBrand}></div>
        
        <div class={styles.navItems}>
            {#each navItems as item}
                <a
                    href={"#" + item.path}
                    use:link
                    class={`${styles.navLink} ${$currentPath === item.path ? styles.active : ''}`}
                >
                    <div class={styles.linkContent}>
                        <i class={`${item.icon} ${styles.linkIcon}`}></i>
                        <span class={styles.linkText}>{item.title}</span>
                    </div>
                    <div class={styles.activeIndicator}></div>
                </a>
            {/each}
        </div>
    </div>
</nav>