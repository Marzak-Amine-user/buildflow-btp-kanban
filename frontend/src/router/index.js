import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import KanbanView from '../views/KanbanView.vue'
import TaskDetailView from '../views/TaskDetailView.vue'
import ReportsView from '../views/ReportsView.vue'
import TeamView from '../views/TeamView.vue'
import PlanningView from '../views/PlanningView.vue'

const routes = [
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/projects', name: 'projects', component: ProjectsView },
  { path: '/kanban/:id', name: 'kanban', component: KanbanView, props: true },
  { path: '/tasks/:id', name: 'task-detail', component: TaskDetailView, props: true },
  { path: '/planning', name: 'planning', component: PlanningView },
  { path: '/reports', name: 'reports', component: ReportsView },
  { path: '/team', name: 'team', component: TeamView }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
