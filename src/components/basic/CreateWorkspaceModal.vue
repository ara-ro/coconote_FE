<template>
  <v-dialog max-width="500px">
    <v-card>
      <v-card-title class="text-h5 text-center">
        워크스페이스 생성하기 </v-card-title><br />
      <v-card-text>
        <v-form @submit.prevent="createWorkspace">
          <v-text-field label="워크스페이스의 이름을 입력하세요" v-model="name" required :rules="nameRules">
          </v-text-field>
          <v-text-field label="워크스페이스의 설명을 입력하세요." v-model="wsInfo" required>
          </v-text-field>
          <v-btn type="submit" color="blue">완료</v-btn>
          <v-btn color="grey" @click="closeModal">닫기</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
import { mapActions } from "vuex";
import { fetchChannelMemberInfo } from '@/services/channelService'; // 모듈 import

export default {
  data() {
    return {
      name: "",
      wsInfo: "",
      channelId: null,
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length >= 1) || 'Name must be at least 1 characters'
      ],
    }
  },
  methods: {
    ...mapActions([
      "setWorkspaceInfoActions",
      "setWorkspaceNameInfoActions",
      "setMemberInfoActions",
      "setChannelInfoActions",
      "setChannelNameInfoActions",
      "setChannelDescInfoActions",
      "setChannelRoleInfoActions"

    ]),
    async createWorkspace() {
      if (this.name.length <= 0) {
        return;
      }

      const body = {
        name: this.name,
        wsInfo: this.wsInfo,
      }
      try {
        const wsInfo = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/workspace/create`, body);

        // 새로 만든 워크스페이스로 이동하는 로직
        this.setWorkspaceInfoActions(wsInfo.data.result.workspaceId);
        this.setWorkspaceNameInfoActions(wsInfo.data.result.name);
        const newWorkspaceId = wsInfo.data.result.workspaceId;

        const response = await axios.get( // 내 워크스페이스 회원 정보도 수정
          `${process.env.VUE_APP_API_BASE_URL}/member/me/workspace/${newWorkspaceId}`
        );
        const myInfo = {
          nickname: response.data.result.nickname,
          workspaceMemberId: response.data.result.workspaceMemberId,
          profileImage: response.data.result.profileImage,
          wsRole: response.data.result.wsRole,
        };
        this.setMemberInfoActions(myInfo);

        const chInfo = await axios.get( // 채널 정보도 수정
          `${process.env.VUE_APP_API_BASE_URL}/${newWorkspaceId}/channel/first`
        );
        this.setChannelInfoActions(chInfo.data.result.channelId);
        this.setChannelNameInfoActions(chInfo.data.result.channelName);
        this.setChannelDescInfoActions(chInfo.data.result.channelInfo);

        this.channelId = chInfo.data.result.channelId;
        this.getChannelMemberInfo();

        this.$emit('update:dialog', false);
        // //console.log("생성 후 workspace로 이동 예정 >> ", newWorkspaceId)
        window.location.href = "/workspace";
      } catch (e) {
        // //console.log(e);
      }
    },
    async getChannelMemberInfo() {
      const result = await fetchChannelMemberInfo(this.channelId); // 모듈로 함수 호출
      if (result) {
        this.setChannelRoleInfoActions(result.channelRole);
      }
    },
    closeModal() {
      this.$emit('update:dialog', false);
    }
  }
}
</script>
