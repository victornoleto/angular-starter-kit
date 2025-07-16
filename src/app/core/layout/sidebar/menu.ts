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
                link: '/dashboard',
            },
        ]
    },
    {
        legend: 'Cadastros',
        children: [
            {
                label: 'Usuários',
                icon: 'fal fa-users',
                link: '/users',
            },
            {
                label: 'Page B',
                icon: 'fal fa-heart',
                children: [
                    {
                        label: 'Subpage B1',
                        link: '/subpage-b1',
                    },
                    {
                        label: 'Subpage B2',
                        link: '/subpage-b2',
                    }
                ]
            },
            {
                label: 'Page C',
                icon: 'fal fa-users',
                children: [
                    {
                        label: 'Subpage C1',
                        link: '/subpage-c1',
                    },
                    {
                        label: 'Subpage C2',
                        link: '/subpage-c2',
                    },
                    {
                        label: 'Subpage C3',
                        children: [
                            {
                                label: 'Subpage C3.1',
                                link: '/subpage-c3-1',
                            },
                            {
                                label: 'Subpage C3.2',
                                link: '/subpage-c3-2',
                            }
                        ]
                    }
                ]
            },
        ]
    },
];