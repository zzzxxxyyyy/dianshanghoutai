import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { anyRoutes, resetRouter, asyncRoutes, constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        routes: [],
        roles: [],
        buttons: [],
        resultAsyncRoutes: [],
        resultAllRoutes: []
    }
}

const state = getDefaultState()

const mutations = {
        RESET_STATE: (state) => {
            Object.assign(state, getDefaultState())
        },
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_USERINFO: (state, userInfo) => {
            state.name = userInfo.name;
            state.avatar = userInfo.avatar
            state.routes = userInfo.routes;
            state.buttons = userInfo.buttons;
            state.roles = userInfo.roles;
        },
        SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
            state.resultAsyncRoutes = asyncRoutes
            state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
                // 给路由添加新的路由
            router.addRoutes(state.resultAllRoutes)
        }
    }
    // 定义一个函数。两个数组进行对比，对比当前用户到第显示那些异步路由
const componentAsyncRoutes = (asyncRoutes, routes) => {
    return asyncRoutes.filter(item => {
        // 数组当中没有这个元素返回索引值为-1
        if (routes.indexOf(item.name) != -1) {
            // 递归
            if (item.children && item.children.length) {
                item.children = componentAsyncRoutes(item.children, routes)
            }
            return true;
        }
    })

}
const actions = {
    // user login 登录处理的业务
    async login({ commit }, userInfo) {
        const { username, password } = userInfo
        let result = await login({ username: username.trim(), password: password })
        if (result.code === 20000) {
            commit('SET_TOKEN', result.data.token)
            setToken(result.data.token)
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
        // return new Promise((resolve, reject) => {
        //   login({ username: username.trim(), password: password }).then(response => {
        //     const { data } = response
        //     commit('SET_TOKEN', data.token)
        //     setToken(data.token)
        //     resolve()
        //   }).catch(error => {
        //     reject(error)
        //   })
        // })
    },

    // get user info 获取用户信息
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response
                commit('SET_USERINFO', data)
                commit('SET_RESULTASYNCROUTES', componentAsyncRoutes(asyncRoutes, data.routes))
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout 用户退出
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}