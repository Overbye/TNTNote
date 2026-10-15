import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { resetDatabaseForTests } from './data/noteRepository'

afterEach(async () => { cleanup(); await resetDatabaseForTests() })

describe('TNTNote MVP', () => {
  it('opens an editable blank note without authentication', async () => {
    render(<App />)
    const editor = await screen.findByLabelText('便签内容')
    await userEvent.type(editor, '# 第一张便签')
    expect(editor).toHaveValue('# 第一张便签')
    expect(screen.getByText('游客 · 本地')).toBeInTheDocument()
  })
  it('creates another note and previews Markdown', async () => {
    render(<App />)
    await screen.findByLabelText('便签内容')
    await userEvent.click(screen.getByRole('button', { name: /新建/ }))
    expect(screen.getByText('2 张便签')).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('便签内容'), '**离线可用**')
    await userEvent.click(screen.getByRole('button', { name: /预览/ }))
    expect(screen.getByText('离线可用', { selector: 'strong' })).toBeInTheDocument()
  })
  it('collapses the category column instead of opening a desktop overlay', async () => {
    const { container } = render(<App />)
    await screen.findByLabelText('便签内容')
    await userEvent.click(screen.getByRole('button', { name: '切换目录' }))
    expect(container.querySelector('.app-shell')).toHaveClass('desktop-category-collapsed')
    expect(container.querySelector('.navigation-scrim')).not.toBeInTheDocument()
  })
})
