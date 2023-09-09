<template>
        <div class="col-12">
                <Menubar :model="menuOptions">
                    <template #start>
                        <Dropdown v-model="pagination.perPage" name="pages">
                            <option v-for="item in pagination.perPageOptions" :key="item" :label="item" :value="item">
                                {{ item }}
                            </option>
                        </Dropdown>
                    </template>
                    <template #end>

                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText type="text" v-model="query"  :placeholder="query ? query : 'Search ...'" placeholder="Search" />
                        </span>
                    </template>
                </Menubar>
            </div>
</template>
<script>
/* eslint-disable */
export default {
    name: "VideoLibraryToolbar",
    data: () => ({
        pagination: {
            perPage: 5,
            currentPage: 1,
            perPageOptions: [5, 10, 25, 50],
            
        },
        menuOptions: [
            {
                label: 'All',
                to: '/library'
            },
            {
                label: 'Finished',
                to: '/library#/finished'
            },
            {
                label: 'Original',
                to: '/library#/original'
            },
            {
                label: 'Unfinished',
                to: '/library#/preview'
            }
        ],
        query: "",
        total: 0,
    }),
    watch: {
        query: {
            handler: "getListDebounced",
            immediate: true,
        },
        pagination: {
            handler: "getListDebounced",
            immediate: true,
        }
    },

    methods: {
        updateQuery(query) {
            this.$emit.change - query(query);
        },
        setPagination(pagination) {
            this.$emit.change - pagination(pagination);
        },
    }
};
</script>
