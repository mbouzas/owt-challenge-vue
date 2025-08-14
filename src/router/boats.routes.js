import { Layout, List, AddEdit } from '@/views/boats';

export default {
    path: '/boats',
    component: Layout,
    children: [
        { path: '', component: List },
        { path: 'add', component: AddEdit },
        { path: 'edit/:id', component: AddEdit }
    ]
};
