import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import toIco from 'to-ico'

const projectRoot = process.cwd()
const inputPath = path.join(projectRoot, 'src', 'app', 'icon.png')
const outPath = path.join(projectRoot, 'src', 'app', 'favicon.ico')

async function main() {
  const png = await fs.readFile(inputPath)

  const sizes = [16, 32, 48]
  const buffers = await Promise.all(
    sizes.map((s) =>
      sharp(png)
        .resize(s, s, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer()
    )
  )

  const ico = await toIco(buffers)
  await fs.writeFile(outPath, ico)

  console.log(`Generated: ${path.relative(projectRoot, outPath)}`)
}

main().catch((err) => {
  console.error('Failed to generate favicon.ico:', err)
  process.exit(1)
})
