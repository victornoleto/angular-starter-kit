export interface MenuItem {
    label: string;
    icon?: string;
    link?: string;
    children?: MenuItem[];
};

export interface MenuSection {
    legend?: string;
    children: MenuItem[];
};

export const menu: MenuSection[] = [
    {
        children: [
            {
                label: 'Dashboard',
                icon: 'fal fa-home',
                link: 'dashboard',
            }
        ]
    },
    {
        legend: 'Cadastro',
        children: [
            {
                label: 'Cargos',
                icon: 'fal fa-users',
                link: 'roles',
            },
            {
                label: 'Colaboradores',
                icon: 'fal fa-users',
                link: 'employees',
            },
            {
                label: 'Clientes',
                icon: 'fal fa-users',
                link: 'customers',
            },
        ]
    },
    {
        legend: 'Pages',
        children: [
            {
                label: 'Page 1',
                icon: 'fal fa-star',
                children: [
                    {
                        label: 'Subpage 1',
                        link: 'subpage1',
                    },
                    {
                        label: 'Subpage 2',
                        link: 'subpage2',
                    }
                ]
            },
            {
                label: 'Page 2',
                icon: 'fal fa-star',
                children: [
                    {
                        label: 'Subpage 1',
                        link: 'subpage1',
                    },
                    {
                        label: 'Subpage 2',
                        link: 'subpage2',
                    }
                ]
            }
        ]
    }
];