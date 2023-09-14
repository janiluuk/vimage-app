<template>
    <div class="grid p-fluid">
        <div class="col-12">

            <Menubar :model="menuOptions">
                <template #end>

                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText type="text" v-model="query" :placeholder="query ? query : 'Search ...'"
                            placeholder="Search" />
                    </span>
                </template>
            </Menubar>
        </div>

    </div>
</template>
<script>
/* eslint-disable */
export default {
    name: "VideoLibraryTabsToolbar",
    data: () => ({

        menuOptions: [
            {
                label: 'All projects',
                to: '/library',
                class: 'p-highlight'
            },
            {
                label: 'Finished projects',
                to: '/library/#finished'
            },
            {
                label: 'Unfinished projects',
                to: '/library/#preview'
            }
        ],
        generatorOptions: [
            {
                label: 'All',
                value: '',
            },
            {
                label: 'Video to Video',
                value: 'vid2vid',
            },
            {
                label: 'Picture to Video',
                value: 'deforum'
            }
        ],
        query: "",

    }),
    watch: {
        query: {
            handler: "getListDebounced",
            immediate: true,
        }
    },

    methods: {
        updateQuery(query) {
            this.$emit.change - query(query);
        },
        getCollection(statuses) {
            return _.filter(this.collection, function (item) { return _.includes(statuses, item.status) || !statuses ? item : false });
        },
        changeTab(tabIndex) {
            this.activeTab = tabIndex;
        },
        getListDebounced: _.debounce(function () {
            this.getList();
        }, 300),
        getList() {
            let params = {
                include: "modelfile,user",
                ...(this.sort ? { sort: this.sort } : {}),
                filter: {
                    ...(this.query ? { name: this.query } : {}),
                    ...(this.query ? { filename: this.query } : {}),
                    ...(this.query ? { status: this.query } : {}),
                    ...(this.generator ? { generator: this.generator } : {}),

                }
            };

            this.$store.dispatch("videojobs/list", params).then(() => {
                this.collection = this.$store.getters["videojobs/list"];
                this.total = this.$store.getters["videojobs/listTotal"];
            });
        },
    }
};
</script>
