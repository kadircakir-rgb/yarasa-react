interface Props {
  title: string
  subtitle?: string
  bg?: string
  crumb?: string
}

export default function PageTitle({ title, subtitle, bg = '/assets/img/page-title-bg.webp' }: Props) {
  return (
    <div className="page-title dark-background" data-aos="fade" style={{ backgroundImage: `url(${bg})` }}>
      <div className="container position-relative">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  )
}
