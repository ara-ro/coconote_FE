import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/views/HomePage.vue';
import OAuth2Success from '@/views/OAuth2Success.vue'; // OAuth2 성공 페이지 컴포넌트
import MemberView from '@/views/member/MemberView.vue';

import { canvasRouter } from '@/router/canvasRouter';
import { threadRouter } from '@/router/threadRouter'
import { channelRouter } from '@/router/channelRouter'
import { driveRouter } from '@/router/driveRouter'
import SearchComponent from '@/components/search/SearchComponent.vue';
import { workspaceRouter } from '@/router/workspaceRouter';
import { memberRouter } from '@/router/memberRouter';
import SplitView from '@/views/SplitView.vue';
import Invitation from '@/views/workspace/InvitationView.vue'; // Invitation.vue 컴포넌트 추가

const routes = [
    {
        // path로도 라우팅이 가능하고, name으로도 라우팅이 가능
        // name으로 라우팅하는 경우는 js코드내에서 라우팅하는 경우
        path: '/',
        name: 'HOME',
        meta: { showHeaderAndSidebar: false },
        component: HomePage
    },
    // {
    //     path: '/login',
    //     name: 'LOGIN',
    //     meta: { showHeaderAndSidebar: false },
    //     component: LoginPage,
    //     beforeEnter(to, from, next) {
    //         //console.log("Entering LOGIN route with meta:", to.meta.showHeaderAndSidebar);
    //         next(); // 이동할지 여부를 결정
    //     },
    // },
    {
        path: '/oauth2/success',
        name: 'OAuth2Success',
        meta: { showHeaderAndSidebar: false },
        component: OAuth2Success, // 컴포넌트 경로를 실제 파일로 변경해 주세요.
    },
    {
        path: '/member/:workspaceId',
        name: 'MemberView',
        component: MemberView,
        props: true
    },
    {
        path: '/workspace/:workspaceId/search',
        name: 'SEARCH',
        component: SearchComponent,
        props: true  // workspaceId를 props로 전달하기 위해 설정
    },
    {
        path: '/invite', // 초대 링크 라우터 추가
        name: 'INVITATION',
        meta: { showHeaderAndSidebar: false },
        component: Invitation, // Invitation 컴포넌트를 연결
        props: (route) => ({ token: route.query.token })  // 초대 링크의 token 쿼리 파라미터를 props로 전달
    },
    {
        path: '/channel/:channelId/split-view',
        name: 'SplitView',
        component: SplitView,
        props: true, // to pass channelId as a prop
    },
    ...workspaceRouter,
    ...channelRouter,
    ...canvasRouter,
    ...threadRouter,
    ...driveRouter,
    ...memberRouter
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;