<template>
<footer class="footer footer-big">
            <div class="container">
                <div class="row">
                    <div class="col-md-6 col-sm-9 ml-auto mr-auto">
                        <div class="links">
                            <ul class="uppercase-links">
                                <li>
                                    <router-link :to="`/`">
                                        Главная
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :to="`/stats`">
                                        Статистика
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :to="`/news`">
                                        Новости
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :to="`/contacts`">
                                        Контакты
                                    </router-link>
                                </li>
                            </ul>
                            <hr>

                            <div class="copyright">
                                © 2017, made with <i class="fa fa-heart heart"></i>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4 col-sm-2">
                        <div class="social-area">
                            <a href="https://maratgaliev.com" class="btn btn-neutral btn-just-icon btn-safari">
                               <i class="fa fa-safari" aria-hidden="true"></i>
                           </a>
                            <a href="https://github.com/maratgaliev" class="btn btn-neutral btn-just-icon btn-github">
                               <i class="fa fa-github" aria-hidden="true"></i>
                           </a>
                            <a href="https://twitter.com/Marat_Galiev" class="btn btn-neutral btn-just-icon btn-twitter">
                                <i class="fa fa-twitter" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
</template>

<script>
export default {
  name: 'Foot'
}
</script>

<style>
</style>